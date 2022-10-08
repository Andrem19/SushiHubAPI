using API.Data;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;
        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;
        public PaymentService(UserManager<User> userManager, IConfiguration config, StoreContext context)
        {
            _config = config;
            _context = context;
            _userManager = userManager;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            var basket = await _context.Baskets.Include(o => o.Items).FirstOrDefaultAsync(x => x.basket_id == basketId);

            if (basket == null) return null;

            double shippingPrice = 0;
            double mult = 1;

            if (basket.DeliveryMethod == 1)
            {
                if (basket.promoDisc.Length > 8)
                {
                    mult -= 0.1;
                }
                else
                {
                    if (basket.refDisc)
                    {
                        mult -= 0.1;
                    }

                    if (basket.acumDisc)
                    {
                        mult -= 0.1;
                    }
                }
                mult -= 0.1;
            }
            else if (basket.DeliveryMethod == 0)
            {
                if (basket.promoDisc.Length > 8)
                {
                    mult -= 0.1;
                }
                else
                {
                    if (basket.refDisc)
                    {
                        mult -= 0.1;
                    }

                    if (basket.acumDisc)
                    {
                        mult -= 0.1;
                    }
                }
            }
            else
            {
                if (basket.promoDisc.Length > 8)
                {
                    mult -= 0.1;
                }
                else
                {
                    if (basket.refDisc)
                    {
                        mult -= 0.1;
                    }

                    if (basket.acumDisc)
                    {
                        mult -= 0.1;
                    }
                }
                shippingPrice = basket.DeliveryMethod;
            }

            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.IdProd);
                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                double amount = (double)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) * mult + shippingPrice;
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)amount,
                    Currency = "gbp",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            {
                double amount = (double)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) * mult + shippingPrice;
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)amount
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            await _context.SaveChangesAsync();

            return basket;
        }

        public async Task<API.Entities.OrderAggregate.Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == paymentIntentId);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentFailed;

            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<API.Entities.OrderAggregate.Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == paymentIntentId);

            if (order == null) return null;

            order.Status = OrderStatus.PaymentReceived;
            await _context.SaveChangesAsync();
            //Promo Codes
            if (order.promoDisc.Length > 8)
            {
                var promo = await _context.PromoCodes.FirstOrDefaultAsync(x => x.Code == order.promoDisc);
                if (promo != null && promo.Status != "Forever" && promo.Status != "forever")
                {
                    promo.Status = "Used";
                    await _context.SaveChangesAsync();
                }
            }
            //Users ref and acum discounts
            var user = _userManager.Users.FirstOrDefault(x => x.Email == order.BuyerEmail);

            if (user != null)
            {
                if (order.refDisc == true)
                {
                    user.RefDiscount -=1;
                }
                if (order.acumDisc == true)
                {
                    user.AcumDiscount = false;
                    user.OldSumOfOrder = user.SumOfOrders;
                }
                user.SumOfOrders += order.total;
                if ((user.OldSumOfOrder + 100) < user.SumOfOrders)
                {
                    user.AcumDiscount = true;
                }
                await _userManager.UpdateAsync(user);
                if (user.RefCodeOfMyRefer != null)
                {
                    var refUser = _userManager.Users.FirstOrDefault(x => x.MyRefCode == user.RefCodeOfMyRefer);
                    if (refUser != null)
                    {
                        refUser.RefDiscount +=1;
                        await _userManager.UpdateAsync(refUser);
                    }
                }
            }

            return order;
        }
    }
}
