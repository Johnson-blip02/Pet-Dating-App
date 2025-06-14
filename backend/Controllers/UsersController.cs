using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public ActionResult<List<User>> Get() => _userService.Get();

        [HttpGet("{id}")]
        public ActionResult<User> Get(string id)
        {
            var user = _userService.Get(id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            _userService.Create(user);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, User userIn)
        {
            var user = _userService.Get(id);
            if (user == null) return NotFound();
            _userService.Update(id, userIn);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var user = _userService.Get(id);
            if (user == null) return NotFound();
            _userService.Remove(id);
            return NoContent();
        }
    }
}
