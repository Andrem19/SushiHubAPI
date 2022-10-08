using API.Data;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Interfaces;
using GoogleMaps.LocationServices;

namespace API.Services
{
    public class MapService : IMapService
    {
        public IConfiguration _config { get; set; }
        public StoreContext _context { get; set; }

        public MapService(IConfiguration config, StoreContext context)
        {
            _config = config;
            _context = context;
        }

        public PointReturn WhereIsOrder(ShippingInfo shippingInfo)
        {
            double Latitude;
            double Longitude;
            List<Square> squares = _context.Squares.Where(x => x.City == shippingInfo.City).ToList();

            AddressData address = new AddressData 
            {
                Address = $"{shippingInfo.NumberOfHouse} {shippingInfo.Street}",
                City = $"{shippingInfo.City}",
                State = null,
                Country = "UK",
                Zip = $"{shippingInfo.PostCode}"
            };

            var gls = new GoogleLocationService(apikey: _config["GoogleApikey"]);
            var pointReturn = new PointReturn();
            pointReturn.Enable = false;
            pointReturn.PointNumber = "0";
            pointReturn.FreeZone = false;
            try
            {
                var latlong = gls.GetLatLongFromAddress(address);
                Latitude = latlong.Latitude;
                Longitude = latlong.Longitude;

                if (squares.Count>0)
                {

                    for (int i = 0; i < squares.Count; i++)
                    {
                        bool latN = Latitude < squares[i].latN;
                        bool latS = Latitude > squares[i].latS;
                        bool lonE = Longitude < squares[i].lonE;
                        bool lonW = Longitude > squares[i].lonW;
                        if (latN && latS && lonE && lonW)
                        {
                            pointReturn.Enable = true;
                            pointReturn.PointNumber = squares[i].Point;
                            pointReturn.City = squares[i].City;
                            pointReturn.Street = squares[i].Street;
                            pointReturn.House = squares[i].House;
                            pointReturn.PostCode = squares[i].PostCode;
                            pointReturn.DeliveryCost = squares[i].DeliveryCost;
                            if (pointReturn.FreeZone == false)
                            {
                                pointReturn.FreeZone = squares[i].FreeZone;
                            }
                            
                        } 
                        else if (i == squares.Count-1 && pointReturn.Enable == false)
                        {
                            pointReturn.Enable = true;
                            pointReturn.City = squares[i].City;
                            pointReturn.Street = squares[i].Street;
                            pointReturn.House = squares[i].House;
                            pointReturn.PostCode = squares[i].PostCode;
                            pointReturn.DeliveryCost = 0;
                        }
                        
                    }
                    return pointReturn;
                }
                else
                {
                    return new PointReturn { Enable = false, PointNumber = "0", FreeZone = false};
                }
                return new PointReturn { Enable = false, PointNumber = "0", FreeZone = false };
            }
            catch (System.Net.WebException ex)
            {
                return new PointReturn { Enable = false, PointNumber = "0", FreeZone = false };
            }
        }
    }
    public class PointReturn
    {
        public bool Enable { get; set; }
        public string PointNumber { get; set; }
        public bool FreeZone { get; set; }
        public double DeliveryCost { get; set; }
        public string? City { get; set; }
        public string? Street { get; set; }
        public string? House { get; set; }
        public string? PostCode { get; set; }
    }
}
