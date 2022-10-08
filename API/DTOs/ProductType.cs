namespace API.DTOs
{
    public class ProductType
    {
        public ProductType()
        {

        }
        public ProductType(string name, int id)
        {
            Id = id;
            Name = name;
        }
        public int Id { get; set; }
        public string? Name { get; set; }
        
        
    }
}