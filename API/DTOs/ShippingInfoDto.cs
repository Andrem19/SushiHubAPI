using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ShippingInfoDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string NumberOfHouse { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string PostCode { get; set; }

        [Required]
        public string TelephoneNumber { get; set; }

    }
}
