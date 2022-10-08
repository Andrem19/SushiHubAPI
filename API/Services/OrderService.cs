using API.Data;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Interfaces;
using API.Settings;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class OrderService : IOrderService
    {
        private readonly StoreContext _context;
        private readonly IPaymentService _paymentService;
        public OrderService(StoreContext context, IPaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, string basketId, ShippingInfo shippingAddress)
        {
            // get basket from repo
            var basket = await _context.Baskets.Include(o => o.Items).FirstOrDefaultAsync(x => x.basket_id == basketId);

            //update popularity of product
            for (int i = 0; i < basket.Items.Count; i++)
            {
                var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == basket.Items[i].IdProd);
                if (product != null) product.popularity += 1;
                await _context.SaveChangesAsync();
            }

            // get items from the product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.IdProd);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            

            // calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            // check to see if order exists

            var existingOrder = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);

            // create order
            var order = new Order(items, buyerEmail, shippingAddress, basket.DeliveryMethod, basket.refDisc, basket.acumDisc, basket.promoDisc, subtotal, basket.Point, basket.ShippingPrice, basket.PaymentIntentId);

            order.total = order.GetTotal();
            await _context.Orders.AddAsync(order);

            if (existingOrder != null)
            {
                _context.Orders.Remove(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.basket_id);
            }

            await _context.SaveChangesAsync();

            // return order
            return order;
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {

            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(a => a.ShipToAddress)
                .FirstOrDefaultAsync(x=>x.Id == id && x.BuyerEmail == buyerEmail);
        }
        public async Task<Order> GetOrderByIdForModeratorAsync(int id)
        {

            return await _context.Orders
                .Include(o => o.OrderItems)
                .Include(a => a.ShipToAddress)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .Where(x => x.BuyerEmail == buyerEmail)
                .ToListAsync();
        }
        public async Task<IReadOnlyList<Order>> GetOrdersByPointAsync(string point)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .Where(x => x.Point == point)
                .ToListAsync();
        }
        public async Task<IReadOnlyList<Order>> GetOrdersAllAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
}
