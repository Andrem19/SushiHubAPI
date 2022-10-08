namespace API.Entities
{
    public class Category : BaseEntitie
    {
        public string name { get; set; }
        public string imageUrl { get; set; }
        public string? PublicId { get; set; }
    }
}
