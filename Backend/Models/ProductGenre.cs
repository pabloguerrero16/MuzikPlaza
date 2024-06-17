using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class ProductGenre
    {
        public int ProductID { get; set; }
        public int GenreID { get; set; }

        public Product Product { get; set; }
        public Genre Genre { get; set; }
    }
}
