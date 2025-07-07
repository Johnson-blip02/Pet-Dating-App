using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using backend.Models;
using backend.Services;

namespace backend.WebSockets;

public class ChatWebSocketHandler
{
    #region Fields & Constructor
    private readonly ChatMessageService _chatService;

    public ChatWebSocketHandler(ChatMessageService chatService)
    {
        _chatService = chatService;
    }

    private static readonly Dictionary<string, List<WebSocket>> _roomSockets = new();
    #endregion

    #region WebSocket Connection Handling
    public async Task Handle(HttpContext context, WebSocket webSocket)
    {
        var roomId = context.Request.Query["roomId"].ToString();

        if (!string.IsNullOrEmpty(roomId))
        {
            if (!_roomSockets.ContainsKey(roomId))
                _roomSockets[roomId] = new List<WebSocket>();

            if (!_roomSockets[roomId].Contains(webSocket))
                _roomSockets[roomId].Add(webSocket);
        }

        var buffer = new byte[1024 * 4];

        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    await HandleTextMessage(buffer, result.Count, roomId);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }
            }
        }
        catch (WebSocketException ex)
        {
            Console.WriteLine($"⚠️ WebSocket closed unexpectedly: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Unexpected error in WebSocket handler: {ex}");
        }
        finally
        {
            // Clean up socket from room
            foreach (var kvp in _roomSockets)
            {
                kvp.Value.Remove(webSocket);
            }

            if (webSocket.State != WebSocketState.Closed)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            }

            Console.WriteLine($"🔌 WebSocket disconnected from room: {roomId}");
        }
    }


    public void RemoveRoom(string roomId)
    {
        if (_roomSockets.ContainsKey(roomId))
        {
            _roomSockets.Remove(roomId);
            Console.WriteLine($"🧹 Removed room socket group: {roomId}");
        }
    }
    #endregion

    #region Chat Message Processing
    private async Task HandleTextMessage(byte[] buffer, int count, string roomId)
    {
        var json = Encoding.UTF8.GetString(buffer, 0, count);
        var payload = JsonSerializer.Deserialize<ChatMessage>(json);

        if (payload is null) return;

        // Save message
        payload.Timestamp = DateTime.UtcNow;
        await _chatService.SaveMessageAsync(payload);

        // Broadcast to all sockets in room
        var broadcastJson = JsonSerializer.Serialize(payload);
        var encoded = Encoding.UTF8.GetBytes(broadcastJson);
        var segment = new ArraySegment<byte>(encoded);

        var deadSockets = new List<WebSocket>();

        foreach (var socket in _roomSockets[roomId])
        {
            if (socket.State == WebSocketState.Open)
                await socket.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
            else
                deadSockets.Add(socket);
        }

        foreach (var s in deadSockets)
        {
            _roomSockets[roomId].Remove(s);
        }
    }
    #endregion
}
