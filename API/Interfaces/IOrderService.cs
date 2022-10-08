using API.Entities.OrderAggregate;
using API.Settings;

namespace API.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(string buyerEmail, string basketId, ShippingInfo shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);
        Task<Order> GetOrderByIdForModeratorAsync(int id);
        Task<IReadOnlyList<Order>> GetOrdersByPointAsync(string point);
        Task<IReadOnlyList<Order>> GetOrdersAllAsync();
    }
}
