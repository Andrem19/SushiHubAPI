using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public Address? Address { get; set; }
        public int Point { get; set; }
        public string? TelegramBotChatId { get; set; }
        public bool AcumDiscount { get; set; }
        public double OldSumOfOrder { get; set; }
        public double SumOfOrders { get; set; }
        public string? MyRefCode { get; set; }
        public string? RefCodeOfMyRefer { get; set; }
        public int RefDiscount { get; set; }
    }
}
