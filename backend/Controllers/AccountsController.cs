using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AccountsController : ControllerBase
  {
    private readonly AccountService _accountService;

    public AccountsController(AccountService accountService)
    {
      _accountService = accountService;
    }

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

    // GET /api/accounts/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
      var account = _accountService.GetById(id);
      return account == null ? NotFound() : Ok(account);
    }

    // DELETE /api/accounts/{id} (admin only later)
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
      var existing = _accountService.GetById(id);
      if (existing == null) return NotFound();
      _accountService.Delete(id);
      return NoContent();
    }
        
        // PUT /api/accounts/{id}/link-profile
    [HttpPut("{id}/link-profile")]
    public IActionResult LinkPetProfile(string id, [FromBody] LinkProfileRequest request)
    {
        var account = _accountService.GetById(id);
        if (account == null) return NotFound("Account not found");

        _accountService.UpdatePetProfileId(id, request.PetProfileId);
        return NoContent();
    }

    public class LinkProfileRequest
    {
        public string PetProfileId { get; set; } = string.Empty;
    }

    }
    

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
