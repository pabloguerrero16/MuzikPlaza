using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly MuzikPlazaContext _context;

        public GenreController(MuzikPlazaContext context)
        {
            _context = context;
        }

        // Get Genres => api/Genre
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> getGenres()
        {
            try
            {
                var genres = await _context.Genres.ToListAsync();
                return StatusCode(200, genres);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get Genre By ID => api/Genre/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> getGenre(int id)
        {
            try
            {
                var genre = await _context.Genres.FindAsync(id);

                if (genre == null)
                {
                    return StatusCode(400, "Genre Not Found");
                }

                return StatusCode(200, genre);

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Insert Genre => api/Genre
        [HttpPost]
        public async Task<ActionResult<Genre>> createGenre(Genre genre)
        {
            try
            {
                var existingGenre = await _context.Genres.FirstOrDefaultAsync(g => g.Name == genre.Name);
                if (existingGenre != null)
                {
                    return StatusCode(400, "Genre already exists");
                }

                _context.Genres.Add(genre);
                await _context.SaveChangesAsync();
                return StatusCode(200, genre);

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
