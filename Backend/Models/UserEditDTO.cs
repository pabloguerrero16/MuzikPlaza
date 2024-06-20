using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class UserEditDTO
    {
        [Required(ErrorMessage = "Please, insert your name")]
        [StringLength(100)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please, insert your last name")]
        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        public DateTime? BirthDate { get; set; }

        public IFormFile? ProfilePictureFile { get; set; }
    }
}
