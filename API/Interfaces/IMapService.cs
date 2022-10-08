using API.Entities.OrderAggregate;
using API.Services;

namespace API.Interfaces
{
    public interface IMapService
    {
        public PointReturn WhereIsOrder(ShippingInfo shippingInfo);
    }
}
