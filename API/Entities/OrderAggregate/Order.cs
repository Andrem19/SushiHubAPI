namespace API.Entities.OrderAggregate
{
    public class Order : BaseEntitie
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail,
            ShippingInfo shipToAddress, double deliveryMethod, bool refDisc, 
            bool acumDisc, string promoDisc, double subtotal, string point, string sippingPrice, string paymentIntentId)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            this.refDisc = refDisc;
            this.acumDisc = acumDisc;
            this.promoDisc = promoDisc;
            Point = point;
            ShippingPrice = sippingPrice;
            PaymentIntentId = paymentIntentId;
        }

        public string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Point { get; set; }
        public ShippingInfo ShipToAddress { get; set; }
        public double DeliveryMethod { get; set; }
        public string? ShippingPrice { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public double Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public bool ReadyToPickUp { get; set; } = false;
        public string PaymentIntentId { get; set; }
        public bool refDisc { get; set; }
        public bool acumDisc { get; set; }
        public string promoDisc { get; set; }
        public double discount { get; set; }
        public double total { get; set; }

        public double GetTotal()
        {
            if (DeliveryMethod == 1)
            {
                double mult = 1;
                if (promoDisc.Length > 8)
                {
                    mult -= 0.1; 
                    discount += 10;
                }
                else
                {
                    if (refDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }

                    if (acumDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }
                }
                mult -= 0.1; 
                discount += 10;
                return Subtotal * mult;
            } 
            else if (DeliveryMethod == 0)
            {
                double mult = 1;
                if (promoDisc.Length > 8)
                {
                    mult -= 0.1;
                    discount += 10;
                }
                else
                {
                    if (refDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }

                    if (acumDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }
                }
                return Subtotal * mult;
            }
            else
            {
                double mult = 1;
                if (promoDisc.Length > 8)
                {
                    mult -= 0.1;
                    discount += 10;
                }
                else
                {
                    if (refDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }

                    if (acumDisc)
                    {
                        mult -= 0.1;
                        discount += 10;
                    }
                }
                return Subtotal * mult + DeliveryMethod;
            }
        }
    }
}
