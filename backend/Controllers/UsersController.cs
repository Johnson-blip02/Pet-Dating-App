using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;


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
    public ActionResult<List<User>> GetFilteredUsers(
        [FromQuery] string? petType,
        [FromQuery] int? minAge,
        [FromQuery] int? maxAge,
        [FromQuery] string? location,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10)
    {
        var filter = Builders<User>.Filter.Empty;

        if (!string.IsNullOrEmpty(petType))
            filter &= Builders<User>.Filter.Eq(u => u.PetType, petType);

        if (!string.IsNullOrEmpty(location))
            filter &= Builders<User>.Filter.Eq(u => u.Location, location);

        if (minAge.HasValue)
            filter &= Builders<User>.Filter.Gte(u => u.Age, minAge.Value);

        if (maxAge.HasValue)
            filter &= Builders<User>.Filter.Lte(u => u.Age, maxAge.Value);

        var skip = (page - 1) * limit;

        var collection = _userService.GetCollection();
        var users = collection.Find(filter).Skip(skip).Limit(limit).ToList();
        var totalCount = (int)collection.CountDocuments(filter);

        return Ok(new { users, totalCount });
    }


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
