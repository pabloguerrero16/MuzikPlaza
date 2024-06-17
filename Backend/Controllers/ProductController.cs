using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly MuzikPlazaContext _context;
        private readonly IWebHostEnvironment _enviorenment;

        public ProductController(MuzikPlazaContext context, IWebHostEnvironment enviorenment)
        {
            _context = context;
            _enviorenment = enviorenment;
        }

        // Get All Products => api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> getProducts()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Artist)
                    .Include(p => p.Format)
                    .Include(p => p.ProductGenres).ThenInclude(pg => pg.Genre)
                    .Include(p => p.Images)
                    .ToListAsync();

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                var jsonResult = JsonSerializer.Serialize(products, options);

                return new ContentResult
                {
                    Content = jsonResult,
                    ContentType = "application/json",
                    StatusCode = 200
                };

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get Single Product => api/Product/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> getProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include (p => p.Artist)
                    .Include (p => p.Format)
                    .Include (p => p.ProductGenres).ThenInclude(pg => pg.Genre)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.ProductID == id);

                if (product == null)
                {
                    return StatusCode(400, "Product Not Found");
                }

                var options = new JsonSerializerOptions
                {
                    ReferenceHandler = ReferenceHandler.Preserve
                };

                var jsonResult = JsonSerializer.Serialize(product, options);

                return new ContentResult
                {
                    Content = jsonResult,
                    ContentType = "application/json",
                    StatusCode = 200
                };

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Update Product => api/Product/id
        [HttpPut("{id}")]
        public async Task<IActionResult> updateProduct(int id, [FromForm] ProductDTO dto)
        {
            if (id <= 0)
            {
                return StatusCode(400, "Invalid Product ID");
            }

            var product = await _context.Products
                .Include(p => p.ProductGenres)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.ProductID == id);

            if (product == null)
            {
                return StatusCode(400, "Product Not Found");
            }

            product.Name = dto.Name;
            product.ArtistID = dto.ArtistID;
            product.FormatID = dto.FormatID;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.Description = dto.Description;

            var genres = await _context.Genres.Where(g => dto.GenreIDs.Contains(g.GenreID)).ToListAsync();
            if (genres.Count != dto.GenreIDs.Count)
            {
                return StatusCode(400, "Invalid Genre ID(s)");
            }
            product.ProductGenres = genres.Select(g => new ProductGenre { GenreID = g.GenreID, ProductID = id }).ToList();

            // IMAGES
            if(dto.Images != null && dto.Images.Count > 0)
            {

                foreach (var image in product.Images)
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), image.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Images.RemoveRange(product.Images);

                var productImages = new List<Image>();
                foreach (var imageFile in dto.Images)
                {
                    if (imageFile != null)
                    {
                        var imagePath = await SaveImageAsync(imageFile);
                        productImages.Add(new Image { ImagePath= imagePath });
                    }
                }

                product.Images = productImages;
            }

            try
            {
                await _context.SaveChangesAsync();
                return StatusCode(200, "Ok");

            } catch (DbUpdateConcurrencyException ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Delete Product = api/Product/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> deleteProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.ProductGenres)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.ProductID == id);

                if (product == null)
                {
                    return StatusCode(400, "Product Not Found");
                }

                foreach (var image in product.Images)
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), image.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Images.RemoveRange(product.Images);
                _context.ProductGenres.RemoveRange(product.ProductGenres);
                _context.Products.Remove(product);

                await _context.SaveChangesAsync();

                return StatusCode(200, "Ok");

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        // Add Product => api/Product
        [HttpPost]
        public async Task<ActionResult<Product>> addProduct([FromForm] ProductDTO dto)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(dto.ArtistID);
                if (artist == null)
                {
                    return StatusCode(400, "Artist does not exist");
                }

                var format = await _context.Formats.FindAsync(dto.FormatID);
                if (format == null)
                {
                    return StatusCode(400, "Format does not exist");
                }

                var genres = await _context.Genres.Where(g => dto.GenreIDs.Contains(g.GenreID)).ToListAsync();
                if (genres.Count != dto.GenreIDs.Count)
                {
                    return StatusCode(400, "Genres do not exist");
                }

                var productImages = new List<Image>();

                if (dto.Images != null)
                {
                    foreach (var imageFile in dto.Images)
                    {
                        if (imageFile != null)
                        {
                            var imagePath = await SaveImageAsync(imageFile);
                            productImages.Add(new Image { ImagePath = imagePath });
                        }
                    }
                }

                var product = new Product
                {
                    Name = dto.Name,
                    ArtistID = dto.ArtistID,
                    FormatID = dto.FormatID,
                    Price = dto.Price,
                    Stock = dto.Stock,
                    Description = dto.Description,
                    Images = productImages,
                    ProductGenres = genres.Select(g => new ProductGenre { GenreID = g.GenreID }).ToList()
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return StatusCode(200, "Ok");

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private async Task<string> SaveImageAsync(IFormFile imageFile)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = $"{Guid.NewGuid().ToString()}_{Path.GetFileName(imageFile.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return Path.Combine("uploads", fileName).Replace("\\", "/");
        }
    }
}
