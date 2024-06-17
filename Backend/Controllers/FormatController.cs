using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormatController : Controller
    {
        private readonly MuzikPlazaContext _context;

        public FormatController(MuzikPlazaContext context)
        {
            _context = context;
        }

        // List Formats => api/Format
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Format>>> getFormats()
        {
            try
            {
                var formats = await _context.Formats.ToListAsync();
                return StatusCode(200, formats);

            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
