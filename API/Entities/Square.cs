namespace API.Entities
{
    public class Square : BaseEntitie
    {
        public string Point { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? House { get; set; }
        public string? PostCode { get; set; }
        public double DeliveryCost { get; set; }
        public bool FreeZone { get; set; }

        public double latN { get; set; }
        public double latS { get; set; }
        public double lonW { get; set; }
        public double lonE { get; set; }
    }
}
