using API.DTOs;
using API.DTOs.FacebookModels;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public AccountController(EmailService emailService, UserManager<User> userManager, TokenService tokenService, IMapper mapper, IConfiguration config)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
            _config = config;
            _emailService = emailService;
        }
        [HttpPost("loginfb")]
        public async Task<ActionResult<UserDto>> LoginFB([FromBody]FbAuthToken body)
        {
            string appId = _config.GetSection("AppId").ToString();
            string appSecret = _config.GetSection("AppSecret").ToString();
            HttpClient client = new HttpClient();
            // 1.generate an app access token
            var appAccessTokenResponse = await client.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_config["AppId"]}&client_secret={_config["AppSecret"]}&grant_type=client_credentials");
            var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);
            // 2. validate the user access token
            var userAccessTokenValidationResponse = await client.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={body.AccessToken}&access_token={appAccessToken.access_token}");
            var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);

            if (!userAccessTokenValidation.data.is_valid)
            {
                return BadRequest(new ProblemDetails { Title = "login_failure" });
            }

            // 3. we've got a valid token so we can request user data from fb
            var userInfoResponse = await client.GetStringAsync($"https://graph.facebook.com/v2.8/me?fields=id,email,first_name,last_name,name,gender,locale,birthday,picture&access_token={body.AccessToken}");
            var userInfo = JsonConvert.DeserializeObject<FacebookUserData>(userInfoResponse);

            User userReturn = await _userManager.FindByNameAsync(userInfo.email);

            if (userReturn == null)
            {
                string code = Guid.NewGuid().ToString().ToUpper().Substring(24);
                var newUser = new User
                {
                    UserName = userInfo.email,
                    Email = userInfo.email,
                    MyRefCode = code,
                    RefCodeOfMyRefer = body?.ReferalCode,
                    AcumDiscount = false,
                    RefDiscount = 0,
                    SumOfOrders = 0,
                    OldSumOfOrder = 0
                };
                string password = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 5) + "Pa$$w0rd";
                var result = await _userManager.CreateAsync(newUser, password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return ValidationProblem();
                }

                await _userManager.AddToRoleAsync(newUser, "Member");

                userReturn = await _userManager.FindByNameAsync(userInfo.email);
            };

            if (userReturn == null)
            {
                return BadRequest(new ProblemDetails { Title = "registration_failure" });
            }
            return new UserDto
            {
                Email = userReturn.Email,
                DisplayName = userReturn.UserName,
                Token = await _tokenService.GenerateToken(userReturn),
                Roles = await _userManager.GetRolesAsync(userReturn),
                Point = userReturn.Point,
                telegramBotChatId = userReturn.TelegramBotChatId,
                MyRefCode = userReturn.MyRefCode,
                RefDiscount = userReturn.RefDiscount,
                AcumDiscount = userReturn.AcumDiscount,
                Address = _mapper.Map<AddressDto>(userReturn.Address)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return BadRequest(new ProblemDetails { Title = "Please confirm your email" });
            }

            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.UserName,
                Token = await _tokenService.GenerateToken(user),
                Roles = await _userManager.GetRolesAsync(user),
                Point = user.Point,
                telegramBotChatId = user.TelegramBotChatId,
                MyRefCode = user.MyRefCode,
                RefDiscount = user.RefDiscount,
                AcumDiscount = user.AcumDiscount,
                Address = _mapper.Map<AddressDto>(user.Address)
            };
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody]RegisterDto registerDto, [FromQuery]string? referal)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
            }
            string code = Guid.NewGuid().ToString().ToUpper().Substring(24);
            var user = new User {
                UserName = registerDto.displayName, 
                Email = registerDto.Email,
                MyRefCode = code, 
                RefCodeOfMyRefer = referal,
                AcumDiscount = false,
                RefDiscount = 0, 
                SumOfOrders = 0, 
                OldSumOfOrder = 0};

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user, "Member");
            User userReturn = await _userManager.FindByEmailAsync(registerDto.Email);
            if (userReturn != null)
            {
                var token = _userManager.GenerateEmailConfirmationTokenAsync(userReturn);
                var confirmationLink = Url.Action("ConfirmEmail", "Account",
                    new {userId = userReturn.Id, token = token.Result}, Request.Scheme);
                await _emailService.SendEmail(user.Email, confirmationLink);
            }
            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.UserName,
                Roles = await _userManager.GetRolesAsync(user),
                Point = user.Point,
                telegramBotChatId = user.TelegramBotChatId,
                MyRefCode = user.MyRefCode,
                RefDiscount = user.RefDiscount,
                AcumDiscount = user.AcumDiscount,
                Address = _mapper.Map<AddressDto>(user.Address)
            };

        }
        [HttpGet("sendconflinkagain")]
        public async Task<ActionResult> SendConfLinkAgain([FromQuery]string email)
        {
            User userReturn = await _userManager.FindByEmailAsync(email);
            if (userReturn != null)
            {
                var token = _userManager.GenerateEmailConfirmationTokenAsync(userReturn);
                var confirmationLink = Url.Action("ConfirmEmail", "Account",
                    new { userId = userReturn.Id, token = token.Result }, Request.Scheme);
                await _emailService.SendEmail(email, confirmationLink);
            }
            return Ok();
        }
        [HttpGet("ConfirmEmail")]
        public async Task<ActionResult<UserDto>> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null) return BadRequest();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) return BadRequest();

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded) return BadRequest();

            return RedirectPermanent("https://www.sushione.co.uk/account/email_success");
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(User);

            return new UserDto
            {
                Email = user.Email,
                DisplayName = user.UserName,
                Token = await _tokenService.GenerateToken(user),
                Roles = await _userManager.GetRolesAsync(user),
                Point = user.Point,
                telegramBotChatId = user.TelegramBotChatId,
                MyRefCode = user.MyRefCode,
                RefDiscount = user.RefDiscount,
                AcumDiscount = user.AcumDiscount,
                
                Address = _mapper.Map<AddressDto>(user.Address)
            };
        }
        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            var user = await _userManager.FindByEmailWithAddressAsync(User);

            return Ok(_mapper.Map<AddressDto>(user.Address));
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<Address>> UpdateUserAddress(AddressDto address)
        {
            var user = await _userManager.FindByEmailWithAddressAsync(User);

            user.Address = _mapper.Map<Address>(address);
            var token = _userManager.GeneratePasswordResetTokenAsync(user);
            await _userManager.RemovePasswordAsync(user);
            await _userManager.AddPasswordAsync(user, "Pa$$w0rd");

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Ok(user.Address);

            return BadRequest("Problem updating the user");
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("password")]
        public async Task<ActionResult> ChangePassword([FromQuery]string email, [FromQuery]string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);

            await _userManager.RemovePasswordAsync(user);
            var user2 = await _userManager.FindByEmailAsync(email);
            await _userManager.AddPasswordAsync(user, newPassword);
            var user3 = await _userManager.FindByEmailAsync(email);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getUserByEmail")]
        public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Ok();

            var userDto = new UserDto();
            userDto.Email = user.Email;
            userDto.DisplayName = user.UserName;
            userDto.Point = user.Point;
            userDto.telegramBotChatId = user.TelegramBotChatId;
            userDto.Roles = await _userManager.GetRolesAsync(user);
            return Ok(userDto);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("addrole")]
        public async Task<ActionResult> AddToRole(string email, string role)
        {
            var user = await _userManager.FindByEmailAsync(email);
            await _userManager.AddToRoleAsync(user, role);

            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("removerole")]
        public async Task<ActionResult> RemoveToRole(string email, string role)
        {
            var user = await _userManager.FindByEmailAsync(email);
            await _userManager.RemoveFromRoleAsync(user, role);
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("addpoint")]
        public async Task<ActionResult> AddPoint(string email, string point)
        {
            var user = await _userManager.FindByEmailAsync(email);
            user.Point = Convert.ToInt32(point);
            await _userManager.UpdateAsync(user);
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("addChatId")]
        public async Task<ActionResult> AddTChatToken(string email, string chatId)
        {
            var user = await _userManager.FindByEmailAsync(email);
            user.TelegramBotChatId = chatId;
            await _userManager.UpdateAsync(user);
            return Ok();
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (!await _userManager.IsInRoleAsync(user, "Admin"))
            {
                await _userManager.DeleteAsync(user);
            }
            return Ok();
        }
    }
}
