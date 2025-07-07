using backend.Models;
using backend.Services;
using backend.WebSockets;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController(UserService userService,
    AccountService accountService,
    ChatMessageService chatService,
    ChatWebSocketHandler wsHandler
    ) : ControllerBase
    {
        private readonly AccountService _accountService = accountService;
        private readonly UserService _userService = userService;
        private readonly ChatMessageService _chatService = chatService;
        private readonly ChatWebSocketHandler _wsHandler = wsHandler;

        #region Registration & Login

        // POST /api/accounts/register
        [HttpPost("register")]
        public IActionResult Register(Account account)
        {
            if (_accountService.GetByEmail(account.Email) != null)
                return BadRequest("Email already registered.");

            var created = _accountService.Create(account);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // POST /api/accounts/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            var account = _accountService.GetByEmail(login.Email);
            if (account == null || account.Password != login.Password)
                return Unauthorized("Invalid email or password.");

            return Ok(account);
        }

        #endregion

        #region Get / Delete

        // GET /api/accounts/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var account = _accountService.GetById(id);
            return account == null ? NotFound() : Ok(account);
        }

        // DELETE /api/accounts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var account = _accountService.GetById(id);
                if (account == null) return NotFound();

                // Delete chat messages involving this accountId (as sender or receiver)
                await _chatService.DeleteAllMessagesByUserIdAsync(id);

                // Delete linked pet profile (and related chat rooms)
                if (!string.IsNullOrEmpty(account.PetProfileId))
                {
                    var user = _userService.Get(account.PetProfileId);
                    if (user != null)
                    {
                        // Delete chat rooms for each liked/likedBy user
                        var allLinkedIds = user.LikedUserIds.Concat(user.LikedByUserIds).Distinct();
                        foreach (var otherId in allLinkedIds)
                        {
                            var roomId = $"room_{new[] { account.PetProfileId, otherId }.OrderBy(id => id).Aggregate((a, b) => $"{a}_{b}")}";
                            await _chatService.DeleteMessagesInRoomAsync(roomId);
                            _wsHandler.RemoveRoom(roomId);
                        }

                        // 🧹 Remove this user's ID from other users' LikedUserIds / LikedByUserIds
                        await _userService.RemoveLikesFromOthersAsync(user.Id!);

                        // Delete the pet profile
                        var petDeleteResult = _userService.DeleteUser(user.Id!);
                        if (petDeleteResult.DeletedCount == 0)
                        {
                            Console.WriteLine($"Warning: Pet profile {user.Id} not found");
                        }
                    }
                }

                // Delete account
                var accountDeleteResult = _accountService.DeleteAccount(id);
                if (accountDeleteResult.DeletedCount == 0)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting account {id}: {ex}");
                return StatusCode(500, "An error occurred while deleting the account");
            }
        }

        #endregion

        #region Link Pet Profile

        // PUT /api/accounts/{id}/link-profile
        [HttpPut("{id}/link-profile")]
        public IActionResult LinkPetProfile(string id, [FromBody] LinkProfileRequest request)
        {
            var account = _accountService.GetById(id);
            if (account == null) return NotFound("Account not found");

            _accountService.UpdatePetProfileId(id, request.PetProfileId);
            return NoContent();
        }

        #endregion

        #region Request DTOs

        public class LinkProfileRequest
        {
            public string PetProfileId { get; set; } = string.Empty;
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        #endregion
    }
}
