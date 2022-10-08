using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public string? Email { get; set; }
        public string? DisplayName { get; set; }
        public string? Token { get; set; }
        public string? telegramBotChatId { get; set; }
        public string? MyRefCode { get; set; }
        public int RefDiscount { get; set; }
        public bool AcumDiscount { get; set; }
        public int Point { get; set; }
        public IList<string> Roles { get; set; }
        public AddressDto Address { get; set; }
    }
}