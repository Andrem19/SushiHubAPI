using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.HubSignalR
{
    public class HubConnection : Hub
    {
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;

        public HubConnection(UserManager<User> userManager, StoreContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task authMe(string email)
        {
            string currSignalrID = Context.ConnectionId;
            var tempPerson = _userManager.Users.FirstOrDefault(x => x.Email == email);
            List<Connections> oldConnections = await _context.Connections.Where(x => x.Email == email).ToListAsync();
            if (oldConnections.Count > 0)
            {
                _context.Connections.RemoveRange(oldConnections);
                await _context.SaveChangesAsync();
            }
            //IList<string> roles = await _userManager.GetRolesAsync(tempPerson);

            if (tempPerson != null) 
            {
                Console.WriteLine("\n" + tempPerson.UserName + " logged in" + "\nSignalrID: " + currSignalrID);

                Connections currUser = new Connections
                {
                    Email = tempPerson.Email,
                    SignalrId = currSignalrID,
                    Point = tempPerson.Point.ToString(),
                };
                await _context.Connections.AddAsync(currUser);
                await _context.SaveChangesAsync();

                await Clients.Caller.SendAsync("authMeResponseSuccess", "You are connected");
            }
            else 
            {
                await Clients.Caller.SendAsync("authMeResponseFail");
            }
        }
    }
}
