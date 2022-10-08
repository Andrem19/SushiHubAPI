namespace API.DTOs
{
    public class OrderDto
    {
        public string BasketId { get; set; }
        public ShippingInfoDto ShipToAddress { get; set; }
    }
}
