using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Errors;
using API.Extensions;
using API.HubSignalR;
using API.Interfaces;
using API.Services;
using API.Settings;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly TelegramService _telegram;

        public OrdersController(IOrderService orderService, IMapper mapper, UserManager<User> userManager, TelegramService telegram)
        {
            _mapper = mapper;
            _orderService = orderService;
            _userManager = userManager;
            _telegram = telegram;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            
            var address = _mapper.Map<ShippingInfoDto, ShippingInfo>(orderDto.ShipToAddress);

            var order = await _orderService.CreateOrderAsync(email, orderDto.BasketId, address);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));
            var users = await _userManager.FindByPoint(Convert.ToInt32(order.Point));
            string message = _telegram.CombainMassage(order);
            for (int i = 0; i < users.Count; i++)
            {
                if (!string.IsNullOrWhiteSpace(users[i].TelegramBotChatId))
                {
                    _telegram.TelegramMessage(users[i].TelegramBotChatId, message);
                }
            }
            
            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.RetrieveEmailFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();
            var Admin = User.IsInRole("Admin");
            var Moderator = User.IsInRole("Moderator");

            var order = await _orderService.GetOrderByIdAsync(id, email);
            if (Admin || Moderator)
            {
                var SpecOrder = await _orderService.GetOrderByIdForModeratorAsync(id);
                if (SpecOrder == null) return NotFound(new ApiResponse(404));
                return _mapper.Map<OrderToReturnDto>(SpecOrder);
            }

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }
        [HttpGet("point")]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersByPoint()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(User);

            IList<string> roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Admin"))
            {
                var ordersAll = await _orderService.GetOrdersAllAsync();
                return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(ordersAll));
            }

            var orders = await _orderService.GetOrdersByPointAsync(user.Point.ToString());

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("all")]
        public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetAllOrders([FromBody]DateFromTo date, [FromQuery]string? point = "")
        {

            DateTime from = new DateTime(date.From.year, date.From.month, date.From.day);
            DateTime to = new DateTime(date.To.year, date.To.month, date.To.day);
            DateTimeOffset fromUtc = new DateTimeOffset(from);
            DateTimeOffset toUtc = new DateTimeOffset(to);

            var orders = await _orderService.GetOrdersAllAsync();

            var orderToReturn = orders.Where(x => x.OrderDate > fromUtc && x.OrderDate < toUtc);
            if (point != "")
            {
                var whithPoint = orderToReturn.Where(x => x.Point == point);
                return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(whithPoint));
            }

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orderToReturn));
        }
    }
}
