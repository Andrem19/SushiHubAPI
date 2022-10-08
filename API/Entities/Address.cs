using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Address
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NumberOfHouse { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string TelephoneNumber { get; set; }

    }
}
