using API.Dtos;
using API.Entities;
using API.RequestHelpers;
using AutoMapper;

namespace API.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductToReturnDto, string>
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public ProductUrlResolver(IConfiguration config, IMapper mapper)
        {
            _config = config;
            _mapper = mapper;
        }

        public string Resolve(Product source, ProductToReturnDto destination, string destMember, 
        ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PictureUrl))
            {
                return _config["ApiUrl"] + source.PictureUrl;
            }
            return null;
        }
    }
}