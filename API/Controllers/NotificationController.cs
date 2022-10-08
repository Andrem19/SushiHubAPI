using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.HubSignalR;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class NotificationController : BaseApiController
    {

        private IHubContext<HubConnection> _hub { get; set; }
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        public NotificationController(IHubContext<HubConnection> hub, UserManager<User> userManager, StoreContext context, IMapper mapper)
        {
            _hub = hub;
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult> NewOrderCreated(string paymentId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == paymentId);
            if (order != null)
            {
                List<Connections> con = await _context.Connections.Where(x => x.Point == order.Point).ToListAsync();
                if (con != null)
                {
                    for (int i = 0; i < con.Count; i++)
                    {
                        var connId = con[i].SignalrId;
                        await _hub.Clients.Client(connId).SendAsync("sendMsgResponse", $"Received a new order\n£{order.total}");
                    }
                }
            }
            return Ok();
        }
        [Authorize(Roles = "Admin, Moderator")]
        [HttpGet("orderReady")]
        public async Task<ActionResult<OrderToReturnDto>> OrderReady(string id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(x => x.Id == Convert.ToInt32(id));
            
            if (order != null)
            {
                var con = await _context.Connections.FirstOrDefaultAsync(x => x.Email == order.BuyerEmail);
                if (con != null)
                {
                    var connId = con.SignalrId;
                    await _hub.Clients.Client(connId).SendAsync("orderIsReady", order.Id.ToString());
                }
                order.ReadyToPickUp = true;
                _context.SaveChanges();
            }
            OrderToReturnDto orderToReturn = _mapper.Map<OrderToReturnDto>(order);
            return Ok(orderToReturn);
        }
    }
}
