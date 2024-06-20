using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ProfilePicture
    {
        [Key]
        public int ProfilePictureID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Required]
        [StringLength(255)]
        public string ImagePath { get; set; }

        [ForeignKey("UserID")]
        public virtual User User { get; set; }
    }
}
