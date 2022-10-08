using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ShippingInfo
    {
        public ShippingInfo()
        {
        }

        public ShippingInfo(string name, string numberOfHouse, string street, string city, string postCode)
        {
            Name = name;
            NumberOfHouse = numberOfHouse;
            Street = street;
            City = city;
            PostCode = postCode;
        }

        public string Name { get; set; }
        public string NumberOfHouse { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string TelephoneNumber { get; set; }
    }
}
