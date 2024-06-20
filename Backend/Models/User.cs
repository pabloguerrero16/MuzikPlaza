using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Backend.Models
{
    public class User
    {
        [Key]
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
        [StringLength(255)]
        public string Password { get; set; }

        [Required]
        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        public DateTime? BirthDate { get; set; }

        [Required]
        public int RoleID { get; set; }

        [StringLength(20)]
        public string? Phone {  get; set; }

        public int? ProfilePictureID { get; set; }

        [ForeignKey("ProfilePictureID")]
        public ProfilePicture ProfilePicture { get; set; }

        [ForeignKey("RoleID")]
        public Role Role { get; set; }

    }
}
