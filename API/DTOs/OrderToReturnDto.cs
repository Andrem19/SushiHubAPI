using API.Entities.OrderAggregate;

namespace API.DTOs
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public ShippingInfo ShipToAddress { get; set; }
        public double DeliveryMethod { get; set; }
        public string ShippingPrice { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; }
        public string? Point { get; set; }
        public double Subtotal { get; set; }
        public double Total { get; set; }
        public double Discount { get; set; }
        public string Status { get; set; }
        public bool ReadyToPickUp { get; set; }
    }
}
