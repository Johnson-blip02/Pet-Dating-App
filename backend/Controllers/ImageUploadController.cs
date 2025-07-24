using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageUploadController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public ImageUploadController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var imageUrl = await _cloudinaryService.UploadImageAsync(file);

            if (imageUrl == null)
                return StatusCode(500, new { message = "Upload failed" });

            return Ok(new { url = imageUrl }); 
        }
    }
}
