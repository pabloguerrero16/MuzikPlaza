using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public int? ArtistID { get; set; }
        public int? FormatID { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; }

        public Artist Artist { get; set; }
        public Format Format { get; set; }
        public ICollection<ProductGenre> ProductGenres { get; set; }
        public ICollection<Image> Images { get; set;}
    }
}
