using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using backend.Models;
using backend.Services;
using backend.Utilities;

namespace backend.WebSockets;

public class ChatWebSocketHandler
{
    private readonly ChatMessageService _chatService;

    public ChatWebSocketHandler(ChatMessageService chatService)
    {
        _chatService = chatService;
    }

    private static readonly Dictionary<string, List<WebSocket>> _roomSockets = new();

    public async Task Handle(HttpContext context, WebSocket webSocket)
    {
        // 🆕 Extract roomId from query string
        var roomId = context.Request.Query["roomId"].ToString();

        if (!string.IsNullOrEmpty(roomId))
        {
            if (!_roomSockets.ContainsKey(roomId))
                _roomSockets[roomId] = new List<WebSocket>();

            if (!_roomSockets[roomId].Contains(webSocket))
                _roomSockets[roomId].Add(webSocket);
        }

        var buffer = new byte[1024 * 4];

        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                var payload = JsonSerializer.Deserialize<ChatMessage>(json);

                if (payload is not null)
                {
                    // Save message to DB
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
                        _roomSockets[roomId].Remove(s);
                }
            }
            else if (result.MessageType == WebSocketMessageType.Close)
            {
                foreach (var kvp in _roomSockets)
                {
                    kvp.Value.Remove(webSocket);
                }

                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            }
        }
    }

}
