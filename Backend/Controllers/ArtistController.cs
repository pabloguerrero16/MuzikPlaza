using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistController : Controller
    {
        private readonly MuzikPlazaContext _context;

        public ArtistController(MuzikPlazaContext context)
        {
            _context = context;
        }

        // List Artists => api/Artist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Artist>>> getAllArtists()
        {
            try
            {
                var artists = await _context.Artists.ToListAsync();
                return StatusCode(200, artists);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get Artist by ID => api/Artist/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Artist>> getArtist(int id)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(id);

                if (artist == null)
                {
                    return StatusCode(400, "Artist Not Found");
                }

                return StatusCode(200, artist);

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Insert Artist => api/Artist
        [HttpPost]
        public async Task<ActionResult<Artist>> createArtist(Artist artist)
        {
            try
            {
                var existingArtist = await _context.Artists.FirstOrDefaultAsync(a => a.Name == artist.Name);
                if (existingArtist != null)
                {
                    return StatusCode(400, "Artist already exists");
                }
                _context.Artists.Add(artist);
                await _context.SaveChangesAsync();
                return StatusCode(200, artist);

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Update Artist => api/Artist
        [HttpPut("{id}")]
        public async Task<ActionResult<Artist>> updateArtist(int id, Artist artist)
        {
            if(id != artist.ArtistID)
            {
                return StatusCode(400, "Artist Not Found");
            }

            try
            {
                _context.Entry(artist).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return StatusCode(200, "Artist Updated.");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArtsitExists(id))
                {
                    return StatusCode(400, "Artist Not Found");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Delete Artist => api/Artist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> delteArtist(int id)
        {
            try
            {
                var artist = await _context.Artists.FindAsync(id);

                if(artist == null)
                {
                    return StatusCode(400, "Artist Not Found");
                }

                _context.Artists.Remove(artist);
                await _context.SaveChangesAsync();

                return StatusCode(200, "Artist Deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool ArtsitExists(int id)
        {
            return _context.Artists.Any(e => e.ArtistID == id);
        }
    }
}
