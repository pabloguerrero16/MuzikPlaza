namespace Backend.Models
{
    public class ProductDTO
    {
        public string Name { get; set; }
        public int ArtistID { get; set; }
        public int FormatID { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string Description { get; set; }
        public List<int> GenreIDs { get; set; }
        public List<IFormFile> Images { get; set;}
    }
}
