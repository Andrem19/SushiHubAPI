using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Ingridients { get; set; }
        public double? Price { get; set; }
        public int popularity { get; set; }
        public IFormFile? File { get; set; }
        public string? Type { get; set; }
        public double? minutesToMake { get; set; }
    }
}
