namespace API.Entities
{
    public class PromoCodes : BaseEntitie
    {
        public string Code { get; set; }
        public DateTime ValidTo { get; set; }
        public string Status { get; set; }
    }
}
