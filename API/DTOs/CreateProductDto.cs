using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Ingridients { get; set; }
        [Required]
        [Range(0, Double.PositiveInfinity)]
        public double Price { get; set; }
        [Required]
        public IFormFile File { get; set; }
        [Required]
        public string productType { get; set; }
        [Required]
        public int popularity { get; set; }
        [Required]
        public decimal? minutesToMake { get; set; }
    }
}
