using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Artist
    {
        public int ArtistID { get; set; }
        public string Name { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
}
