using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController(IWebHostEnvironment env) : ControllerBase
    {
        private readonly IWebHostEnvironment _env = env;

        #region PostMethods
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Create unique file name
            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";

            var savePath = Path.Combine(_env.WebRootPath, "images", fileName);

            // Ensure images directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path to store in MongoDB
            return Ok(new { path = $"images/{fileName}" });
        }
        #endregion
        
        #region PutMethods
        [HttpPut("update")]
        public async Task<IActionResult> Update(IFormFile file, [FromQuery] string? oldPath)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Delete old file if provided
            if (!string.IsNullOrEmpty(oldPath))
            {
                var fullOldPath = Path.Combine(_env.WebRootPath, oldPath);
                if (System.IO.File.Exists(fullOldPath))
                {
                    System.IO.File.Delete(fullOldPath);
                }
            }

            // Save new file
            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var savePath = Path.Combine(_env.WebRootPath, "images", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(savePath)!);

            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { path = $"images/{fileName}" });
        }
        #endregion
    }
}
