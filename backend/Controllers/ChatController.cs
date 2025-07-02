using backend.Models;
using backend.Services;
using backend.WebSockets;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatMessageService _chatService;
    private readonly ChatWebSocketHandler _wsHandler;

    public ChatController(ChatMessageService chatService, ChatWebSocketHandler wsHandler)
    {
        _chatService = chatService;
        _wsHandler = wsHandler;
    }
    public ChatController(ChatMessageService chatService)
    {
        _chatService = chatService;
    }

    #region GetMethods
    [HttpGet("room/{roomId}")]
    public async Task<ActionResult<List<ChatMessage>>> GetMessagesInRoom(string roomId)
    {
        var messages = await _chatService.GetMessagesInRoomAsync(roomId);
        return Ok(messages);
    }
    #endregion

    #region DeleteMethods
    [HttpDelete("room/{roomId}")]
    public async Task<IActionResult> DeleteRoomMessages(string roomId)
    {
        var deletedCount = await _chatService.DeleteMessagesInRoomAsync(roomId);

        // Drop socket group
        _wsHandler.RemoveRoom(roomId);

        return Ok(new { message = $"Deleted {deletedCount} messages and closed room {roomId}." });
    }
    #endregion
}
