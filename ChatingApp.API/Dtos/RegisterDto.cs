using System;
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
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public RegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
            
        }
    }
}