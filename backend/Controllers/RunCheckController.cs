using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("run")]
    [ApiController]
    public class RunCheckController  : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() => Ok("Backend is running");
    }
}