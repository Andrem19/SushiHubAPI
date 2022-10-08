using API.Data;
using API.Dtos;
using API.DTOs;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Helpers;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;
        private readonly IConfiguration _config;
        private readonly StoreContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ProductController(IWebHostEnvironment hostEnvironment, StoreContext context, IMapper mapper, IConfiguration config, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _config = config;
            _context = context;
            _hostingEnvironment = hostEnvironment;
        }
        [HttpGet("getallproducts")]
        public async Task<ActionResult<ProductToReturnDto>> GetAllProducts(string? category = null)
        {
            if (!string.IsNullOrEmpty(category) && category != "All")
            {
                var product = await _context.Products.Where(x => x.ProductType.ToLower() == category.ToLower()).ToListAsync();
                List<ProductToReturnDto> productWithIngridients = new List<ProductToReturnDto>();
                for (int i = 0; i < product.Count; i++)
                {
                    ProductToReturnDto prod = new ProductToReturnDto();
                    prod.Id = product[i].Id;
                    prod.Name = product[i].Name;
                    prod.minutesToMake = product[i].minutesToMake;
                    prod.PictureUrl = product[i].PictureUrl;
                    prod.ProductType = product[i].ProductType;
                    prod.popularity = product[i].popularity;
                    prod.Price = product[i].Price;
                    prod.Ingridients = product[i].Ingridients.Split(',').ToList();
                    productWithIngridients.Add(prod);
                }
                return Ok(productWithIngridients);
            }
            var query = await _context.Products.ToListAsync();

            List<ProductToReturnDto> productWithIng = new List<ProductToReturnDto>();
            for (int i = 0; i < query.Count; i++)
            {
                ProductToReturnDto prod = new ProductToReturnDto();
                prod.Id = query[i].Id;
                prod.Name = query[i].Name;
                prod.minutesToMake = query[i].minutesToMake;
                prod.PictureUrl = query[i].PictureUrl;
                prod.ProductType = query[i].ProductType;
                prod.Price = query[i].Price;
                prod.Ingridients = query[i].Ingridients.Split(',').ToList();
                productWithIng.Add(prod);
            }
            return Ok(productWithIng);
        }
        [HttpGet("category")]
        public async Task<ActionResult<Category>> GetAllCategory()
        {
            var cat = await _context.Categorys.OrderBy(x => x.name).ToListAsync();
            return Ok(cat);
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery] ProductParams productParams)
        {
            var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Types).ToList();

            List<ProductToReturnDto> productWithIng = new List<ProductToReturnDto>();
            for (int i = 0; i < query.Count; i++)
            {
                ProductToReturnDto prod = new ProductToReturnDto();
                prod.Id = query[i].Id;
                prod.Name = query[i].Name;
                prod.minutesToMake = query[i].minutesToMake;
                prod.PictureUrl = query[i].PictureUrl;
                prod.ProductType = query[i].ProductType;
                prod.popularity = query[i].popularity;
                prod.Price = query[i].Price;
                prod.Ingridients = query[i].Ingridients.Split(',').ToList();
                productWithIng.Add(prod);
            }
            IQueryable<ProductToReturnDto> productQ = productWithIng.AsQueryable();
            var counter = productWithIng.Count();

            var products = PagedList<ProductToReturnDto>.ToPagedList(productQ,
                productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            Pagination<ProductToReturnDto> ProductToReturn = new Pagination<ProductToReturnDto>(productParams.PageNumber, productParams.PageSize, counter, products);
            
            return ProductToReturn;
        }

        [HttpGet("{id}", Name = "GetProduct")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var query = await _context.Products.FindAsync(id);

            if (query == null) return NotFound(new ApiResponse(404));

            ProductToReturnDto productToReturn = new ProductToReturnDto();
            productToReturn.Id = query.Id;
            productToReturn.Name = query.Name;
            productToReturn.minutesToMake = query.minutesToMake;
            productToReturn.PictureUrl = query.PictureUrl;
            productToReturn.ProductType = query.ProductType;
            productToReturn.popularity = query.popularity;
            productToReturn.Price = query.Price;
            productToReturn.Ingridients = query.Ingridients.Split(',').ToList();

            return productToReturn;
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            List<Product> products = await _context.Products.ToListAsync();
            List<string> typesName = new();
            List<ProductType> types = new List<ProductType>();
            for (int i = 0; i < products.Count; i++)
            {
                typesName.Add(products[i].ProductType);
            }
            var res = typesName.Distinct().ToList();
            for (int i = 0; i < res.Count; i++)
            {
                types.Add(new ProductType(res[i], i));
            }
            return Ok(types);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
        {
            Product product = _mapper.Map<Product>(productDto);
            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }
            product.popularity = 0;
            await _context.Products.AddAsync(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("category")]
        public async Task<ActionResult<Category>> CreateCategory([FromForm] CreateCategoryDto category)
        {
            Category cat = _mapper.Map<Category>(category);
            if (category.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(category.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                cat.imageUrl = imageResult.SecureUrl.ToString();
                cat.PublicId = imageResult.PublicId;
            }

            await _context.Categorys.AddAsync(cat);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(cat);

            return BadRequest(new ProblemDetails { Title = "Problem creating new category" });
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();
            _mapper.Map(productDto, product);

            if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (!string.IsNullOrEmpty(product.PublicId))
                    await _imageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.PublicId))
                await _imageService.DeleteImageAsync(product.PublicId);

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("category")]
        public async Task<ActionResult> DeleteCategory([FromQuery] int id)
        {
            var cat = await _context.Categorys.FindAsync(id);

            if (cat == null) return NotFound();

            if (!string.IsNullOrEmpty(cat.PublicId))
                await _imageService.DeleteImageAsync(cat.PublicId);

            _context.Categorys.Remove(cat);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting category" });
        }
    }
}
