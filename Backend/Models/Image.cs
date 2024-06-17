namespace Backend.Models
{
    public class Image
    {
        public int ImageID { get; set; }
        public int ProductID { get; set; }
        public string ImagePath { get; set; }

        public Product Product { get; set; }
    }
}
