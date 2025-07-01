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

        #region GetMethods

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
        
        [HttpGet("{id}/matches")]
        public ActionResult<List<User>> GetMutualMatches(string id)
        {
            var currentUser = _userService.Get(id);
            if (currentUser == null || currentUser.Id == null) return NotFound();

            var allUsers = _userService.GetCollection().Find(_ => true).ToList();
            var mutualMatches = allUsers
                .Where(u => 
                    u?.Id != null && 
                    currentUser.LikedUserIds != null && currentUser.LikedUserIds.Contains(u.Id) && 
                    u.LikedUserIds != null && u.LikedUserIds.Contains(currentUser.Id))
                .ToList();

            return Ok(mutualMatches);
        }


        #endregion

        #region PostMethods

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            _userService.Create(user);
            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        #endregion

        #region PutMethods
        [HttpPut("{id}")]
        public IActionResult Update(string id, User userIn)
        {
            var user = _userService.Get(id);
            if (user == null) return NotFound();
            _userService.Update(id, userIn);
            return NoContent();
        }

        [HttpPut("{likerId}/like/{likedId}")]
        public IActionResult LikeUser(string likerId, string likedId)
        {
            var isMatch = _userService.LikeUser(likerId, likedId);
            return Ok(new { match = isMatch });
        }

        #endregion

        #region DeleteMethods

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var user = _userService.Get(id);
            if (user == null) return NotFound();
            _userService.Remove(id);
            return NoContent();
        }

        #endregion
    
    }
}
