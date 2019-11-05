using System.ComponentModel.DataAnnotations;

namespace ChatingApp.API.Dtos
{
    public class RegisterDto
    {
        [Required]

        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4,
         ErrorMessage = "You must specify the password between 4 to 8 characters ")]
        public string Password { get; set; }
    }
}