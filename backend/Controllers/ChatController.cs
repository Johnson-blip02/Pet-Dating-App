using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatMessageService _chatService;

    public ChatController(ChatMessageService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<List<ChatMessage>>> GetMessagesInRoom(string roomId)
    {
        var messages = await _chatService.GetMessagesInRoomAsync(roomId);
        return Ok(messages);
    }
}
