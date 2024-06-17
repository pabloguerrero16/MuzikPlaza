using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Format
    {
        public int FormatID { get; set; }
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}
