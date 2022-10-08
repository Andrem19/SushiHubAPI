using API.Data;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MapController : BaseApiController
    {
        public IConfiguration _config { get; set; }
        public StoreContext _context { get; set; }
        public UserManager<User> _userManager { get; set; }
        public IMapService _mapService { get; set; }

        public MapController(IConfiguration config, StoreContext context, UserManager<User> userManager, IMapService mapService)
        {
            _config = config;
            _context = context;
            _userManager = userManager;
            _mapService = mapService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("setsquare")]
        public async Task<ActionResult<Square>> AddSquare([FromBody]Square square)
        {
            Square newSquare = new Square();

            newSquare.City = square.City;
            newSquare.Street = square.Street;
            newSquare.House = square.House;
            newSquare.PostCode = square.PostCode;
            newSquare.Point = square.Point;
            newSquare.FreeZone = square.FreeZone;
            newSquare.DeliveryCost = square.DeliveryCost;
            newSquare.lonE = square.lonE;
            newSquare.lonW = square.lonW;
            newSquare.latS = square.latS;
            newSquare.latN = square.latN;
            _context.Squares.Add(newSquare);
            _context.SaveChanges();
            return Ok(newSquare);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("deletesquare")]
        public async Task<ActionResult> DeleteSquare(int id)
        {
            Square square = _context.Squares.SingleOrDefault(u => u.Id == id);
            if (square == null) return Ok();

            _context.Remove(square);
            var result = await _context.SaveChangesAsync() > 0;

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getsquares")]
        public async Task<ActionResult<List<Square>>> GetSquares()
        {
            List<Square> listToReturn = _context.Squares.ToList();
            return listToReturn;
        }
        [Authorize]
        [HttpPut("where")]
        public async Task<ActionResult<PointReturn>> WhereIam(ShippingInfo shippingInfo)
        {
            PointReturn pointToReturn = _mapService.WhereIsOrder(shippingInfo);
            return pointToReturn;
        }
    }
}
