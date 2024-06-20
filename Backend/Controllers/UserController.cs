using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MuzikPlazaContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(MuzikPlazaContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        //Get Users => api/User/list
        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> getUsers()
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.ProfilePicture)
                    .Select(u => new UserDTO
                    {
                        UserID = u.UserID,
                        Name = u.Name,
                        LastName = u.LastName,
                        Email = u.Email,
                        RegistrationDate = u.RegistrationDate,
                        BirthDate = u.BirthDate,
                        Phone = string.IsNullOrEmpty(u.Phone) ? "Unspecified" : u.Phone,
                        ProfilePicturePath = u.ProfilePicture != null ? u.ProfilePicture.ImagePath : null
                    })
                    .ToListAsync();

                return Ok(users);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get User By ID => api/User/id
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> getUserById(int id)
        {
            var user = await _context.Users
                .Include(u => u.ProfilePicture)
                .FirstOrDefaultAsync(u => u.UserID == id);

            if(user == null)
            {
                return NotFound("User not Found");
            }

            var userDto = new UserDTO
            {
                UserID = user.UserID,
                Name = user.LastName,
                LastName = user.LastName,
                Email = user.Email,
                RegistrationDate = user.RegistrationDate,
                BirthDate = user.BirthDate,
                Phone = user.Phone,
                ProfilePicturePath = user.ProfilePicture?.ImagePath
            };

            return Ok(userDto);
        }

        
        // Register User => api/User/register
        [HttpPost("register")]
        public async Task<IActionResult> registerUser(UserDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email);
                if (existingUser != null)
                {
                    return BadRequest("Email is alreayd in use.");
                }

                var user = new User
                {
                    Name = userDTO.Name,
                    LastName = userDTO.LastName,
                    Email = userDTO.Email,
                    Password = userDTO.Password,
                    RegistrationDate = userDTO.RegistrationDate,
                    RoleID = 1,
                    Phone = null,
                    ProfilePictureID = null
                };

                user.Password = _passwordHasher.HashPassword(user, userDTO.Password);

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok("User registered correctly");
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        //Edit User => api/User/edit/id
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> editUser(int id, UserEditDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.Name = userDTO.Name;
                user.LastName = userDTO.LastName;
                user.Phone = userDTO.Phone;
                user.BirthDate = userDTO.BirthDate;

                if(userDTO.ProfilePictureFile != null)
                {
                    var imagePath = await SaveProfilePictureAsync(userDTO.ProfilePictureFile);
                    if (!string.IsNullOrEmpty(imagePath))
                    {
                        if(user.ProfilePictureID != null)
                        {
                            var oldProfilePicture = await _context.ProfilePictures.FindAsync(user.ProfilePictureID);
                            if (oldProfilePicture != null)
                            {
                                DeletePicture(oldProfilePicture.ImagePath);
                                _context.ProfilePictures.Remove(oldProfilePicture);
                            }
                        }

                        var profilePicture = new ProfilePicture
                        {
                            UserID = user.UserID,
                            ImagePath = imagePath
                        };

                        _context.ProfilePictures.Add(profilePicture);
                        await _context.SaveChangesAsync();

                        user.ProfilePictureID = profilePicture.ProfilePictureID;
                    }
                }

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok("User updated");
            } catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Delte User => api/User/delete/id
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> deleteUser(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.ProfilePicture)
                    .FirstOrDefaultAsync(u => u.UserID == id);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                if (user.ProfilePicture != null)
                {
                    DeletePicture(user.ProfilePicture.ImagePath);
                    _context.ProfilePictures.Remove(user.ProfilePicture);
                }

                await _context.SaveChangesAsync();

                return Ok("User deleted");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return StatusCode(500, $"Concurrency error occurred: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        
        // Method to save profile pictures
        private async Task<string> SaveProfilePictureAsync(IFormFile imageFile)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "UserImages");

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

            return Path.Combine("uploads", "UserImages", fileName).Replace("\\", "/");
        }

        //Method to delete old pictures
        private void DeletePicture(string imagePath)
        {
            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), imagePath.TrimStart('/'));
            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath);
            }
        }
    }
}
