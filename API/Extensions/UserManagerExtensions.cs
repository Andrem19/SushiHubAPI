using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Extensions
{
    public static class UserManagerExtensions
    {
        public static async Task<User> FindByEmailWithAddressAsync(this UserManager<User> input, ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            return await input.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
        }

        public static async Task<User> FindByEmailFromClaimsPrinciple(this UserManager<User> input, ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            return await input.Users.SingleOrDefaultAsync(x => x.Email == email);
        }
        public static async Task<List<User>> FindByPoint(this UserManager<User> input, int point)
        {
            return await input.Users.Where(x => x.Point == point).ToListAsync();
        }
    }
}
