namespace API.Entities.OrderAggregate
{
    public class OrderItem : BaseEntitie
    {
        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrdered itemOrdered, double price, int quantity)
        {
            ItemOrdered = itemOrdered;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrdered ItemOrdered { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
    }
}
