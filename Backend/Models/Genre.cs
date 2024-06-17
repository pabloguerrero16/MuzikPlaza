using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Genre
    {
        public int GenreID { get; set; }
        public string Name { get; set; }

        public ICollection<ProductGenre>? ProductGenres {  get; set; }    
    }
}
