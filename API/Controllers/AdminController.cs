using API.Data;
using API.Entities;
using API.HubSignalR;
using API.Services;
using API.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private IHubContext<HubConnection> _hub { get; set; }
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;
        private readonly EmailService _emailService;

        public AdminController(EmailService emailService, IHubContext<HubConnection> hub, UserManager<User> userManager, StoreContext context)
        {
            _hub = hub;
            _userManager = userManager;
            _context = context;
            _emailService = emailService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("emailcomfirmletter")]
        public async Task<ActionResult<ISettings>> GetEmailToConfirmLetter()
        {
            ISettings email = new ISettings();
            email.emailLetterConfirm = SettingsVar.EmailLetterConfirm;
            return Ok(email);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("emailcomfirmletter")]
        public async Task<ActionResult<ISettings>> ChangeEmailToConfirmLetter([FromQuery]string email)
        {
            SettingsVar.EmailLetterConfirm = email;
            ISettings emailToRetorn = new ISettings();
            emailToRetorn.emailLetterConfirm = SettingsVar.EmailLetterConfirm;
            return Ok(emailToRetorn);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("saveUsers")]
        public async Task<ActionResult<string>> SaveUsers([FromQuery] string email)
        {
            var users = await _userManager.Users.ToListAsync();
            var json = JsonConvert.SerializeObject(users);
            if (users != null)
            {
                await _emailService.SaveUsers(email, json);
            }
            
            return Ok(json);
        }
    }
}
