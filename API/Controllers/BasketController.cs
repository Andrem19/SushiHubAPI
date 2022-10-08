using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = _context.Baskets.Include(i => i.Items).FirstOrDefault(x => x.basket_id == id);
            return Ok(basket);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getallbaskets")]
        public async Task<ActionResult<List<CustomerBasket>>> GetBaskets()
        {
            var basket = _context.Baskets.ToList();
            return Ok(basket);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> CreateBasket(CustomerBasket basket)
        {
            CustomerBasket newBasket = new CustomerBasket();
            newBasket.basket_id = basket.basket_id;
            for (int i = 0; i < basket.Items.Count; i++)
            {
                BasketItem item = new BasketItem();
                item.IdProd = basket.Items[i].IdProd;
                item.PictureUrl = basket.Items[i].PictureUrl;
                item.ProductName = basket.Items[i].ProductName;
                item.Price = basket.Items[i].Price;
                item.Quantity = basket.Items[i].Quantity;
                item.Type = basket.Items[i].Type;
                newBasket.Items.Add(item);
            }
            newBasket.refDisc = false;
            newBasket.acumDisc = false;
            newBasket.Point = "0";
            newBasket.ShippingPrice = "0";
            newBasket.promoDisc = "1";
            newBasket.DeliveryMethod = 5;
            await _context.Baskets.AddAsync(newBasket);
            await _context.SaveChangesAsync();
            return Ok(newBasket);
        }
        [HttpPut]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updatedBasket = await _context.Baskets
                .Include(i => i.Items)
                .FirstOrDefaultAsync(x => x.basket_id == basket.basket_id);
            var newBasket = new CustomerBasket();
            if (basket.Items.Count > updatedBasket.Items.Count)
            {
                _context.Baskets.Remove(updatedBasket);
                await _context.SaveChangesAsync();
                for (int i = 0; i < basket.Items.Count; i++)
                {
                    BasketItem item = new BasketItem();
                    item.IdProd = basket.Items[i].IdProd;
                    item.PictureUrl = basket.Items[i].PictureUrl;
                    item.ProductName = basket.Items[i].ProductName;
                    item.Price = basket.Items[i].Price;
                    item.Quantity = basket.Items[i].Quantity;
                    item.Type = basket.Items[i].Type;
                    newBasket.Items.Add(item);
                }
                newBasket.basket_id = basket.basket_id;
                newBasket.DeliveryMethod = basket.DeliveryMethod;
                newBasket.ShippingPrice = basket.ShippingPrice;
                newBasket.refDisc = basket.refDisc;
                newBasket.Point = basket?.Point;
                newBasket.acumDisc = basket.acumDisc;
                newBasket.promoDisc = basket.promoDisc;
                newBasket.ClientSecret = basket?.ClientSecret;
                newBasket.PaymentIntentId = basket?.PaymentIntentId;
                await _context.Baskets.AddAsync(newBasket);
            }
            else
            {
                updatedBasket.Items = basket.Items;
                updatedBasket.refDisc = basket.refDisc;
                updatedBasket.acumDisc = basket.acumDisc;
                updatedBasket.Point = basket?.Point;
                updatedBasket.promoDisc = basket?.promoDisc;
                updatedBasket.ClientSecret = basket?.ClientSecret;
                updatedBasket.PaymentIntentId = basket?.PaymentIntentId;
                updatedBasket.DeliveryMethod = basket.DeliveryMethod;
                updatedBasket.ShippingPrice = basket.ShippingPrice;
                newBasket = updatedBasket;
            }
            await _context.SaveChangesAsync();

            return Ok(newBasket);
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id)
        {
            var basket = await _context.Baskets.FirstOrDefaultAsync(x => x.basket_id == id);
            _context.Baskets.Remove(basket);
            await _context.SaveChangesAsync();
        }
    }
}