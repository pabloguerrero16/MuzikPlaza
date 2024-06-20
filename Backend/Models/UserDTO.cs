using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserDTO
    {
        public int UserID { get; set; }

        [Required(ErrorMessage = "Please, insert your name")]
        [StringLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please, insert your last name")]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Insert a valid e-mail address")]
        [StringLength(100)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please type your password")]
        [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Please type your password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        [StringLength(255, MinimumLength = 6)]
        public string ConfirmPassword { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public string? Phone {  get; set; }
        public string? ProfilePicturePath { get; set; }
        public DateTime? BirthDate { get; set; }
    }
}
