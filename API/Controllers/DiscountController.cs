using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DiscountController : BaseApiController
    {
        public StoreContext _context { get; set; }
        public UserManager<User> _userManager { get; set; }
        public DiscountController(UserManager<User> userManager, StoreContext context )
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("promocode")]
        public async Task<ActionResult<bool>> CheckPromoCode(string promo)
        {
            List<PromoCodes> promoCodes = await _context.PromoCodes.ToListAsync();
            for (int i = 0; i < promoCodes.Count; i++)
            {
                if (promoCodes[i].Code.ToLower() == promo.ToLower()
                    && (promoCodes[i].Status == "Free" 
                    || promoCodes[i].Status == "free" 
                    || promoCodes[i].Status == "Forever" 
                    || promoCodes[i].Status == "forever"))
                {
                    if (promoCodes[i].ValidTo > DateTime.UtcNow)
                    {
                        return Ok(true);
                    }
                }
            }
            return Ok(false);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("getAll")]
        public async Task<ActionResult<List<PromoCodes>>> GetAll()
        {
            return await _context.PromoCodes.ToListAsync();
        }
        [Authorize]
        [HttpGet("getreferals")]
        public async Task<ActionResult<List<ReferalsDto>>> GetAllReferals()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(User);
            var users = await _userManager.Users.Where(x => x.RefCodeOfMyRefer == user.MyRefCode).ToListAsync();
            List<ReferalsDto> referals = new List<ReferalsDto>();
            if (users.Count > 0)
            {
                for (int i = 0; i < users.Count; i++)
                {
                    ReferalsDto refer = new();
                    refer.Id = i+1;
                    refer.Code = users[i].MyRefCode;
                    referals.Add(refer);
                }
            }
            return Ok(referals);
        }

        [Authorize]
        [HttpPost("promocode")]
        public async Task<ActionResult<List<PromoCodes>>> CreatePromoCode(PromoDto promo)
        {

            try
            {
                for (int i = 0; i < promo.promo.Count; i++)
                {
                var newProm = new PromoCodes();
                newProm.Code = promo.promo[i];
                newProm.ValidTo = DateTime.UtcNow.AddDays(Convert.ToInt32(promo.date));
                newProm.Status = promo.Status;

                _context.PromoCodes.Add(newProm);

                }
                
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {

                throw;
            }
            

            return Ok(await _context.PromoCodes.OrderByDescending(o => o.ValidTo).ToListAsync());
            
        }
        [Authorize]
        [HttpDelete("promocode")]
        public async Task<ActionResult<List<PromoCodes>>> DeletePromoCode(string promo)
        {
            var promoCode = await _context.PromoCodes.FirstOrDefaultAsync(x => x.Code == promo);
            _context.PromoCodes.Remove(promoCode);
            await _context.SaveChangesAsync();
            return Ok(await _context.PromoCodes.ToListAsync());

        }
    }
}
