using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly CloudinaryService _cloudinaryService;

        public ImageController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        #region PostMethods
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var imageUrl = await _cloudinaryService.UploadImageAsync(file);

            if (imageUrl == null)
                return StatusCode(500, "Upload failed.");

            return Ok(new { path = imageUrl }); // Return full Cloudinary URL
        }
        #endregion

        #region PutMethods
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] IFormFile file, [FromQuery] string? oldPath)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Optional: delete previous Cloudinary image if available
            if (!string.IsNullOrEmpty(oldPath))
            {
                try
                {
                    var uri = new Uri(oldPath);
                    var filename = Path.GetFileNameWithoutExtension(uri.LocalPath); // get "abc123" from the path
                    var folder = Path.GetDirectoryName(uri.LocalPath)?.TrimStart('/');
                    var publicId = string.IsNullOrEmpty(folder) ? filename : $"{folder}/{filename}";

                    await _cloudinaryService.DeleteImageAsync(publicId);
                }
                catch
                {
                    // Silent catch – if URL was malformed or not deletable, continue
                }
            }

            var imageUrl = await _cloudinaryService.UploadImageAsync(file);
            if (imageUrl == null)
                return StatusCode(500, "Upload failed.");

            return Ok(new { path = imageUrl });
        }
        #endregion
    }
}
