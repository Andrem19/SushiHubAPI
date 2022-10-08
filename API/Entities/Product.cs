namespace API.Entities
{
    public class Product : BaseEntitie
    {
        public string? Name { get; set; }
        public string? Ingridients { get; set; }
        public double Price { get; set; }
        public string? PictureUrl { get; set; }
        public string? ProductType { get; set; }
        public double? minutesToMake { get; set; }
        public int? popularity { get; set; } = 0;
        public string? PublicId { get; set; }
    }
}
