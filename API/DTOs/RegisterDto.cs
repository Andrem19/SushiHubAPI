using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto : LoginDto
    {
        [Required]
        public string displayName { get; set; }
    }
}
