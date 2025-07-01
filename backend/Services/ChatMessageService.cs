// Services/ChatMessageService.cs
using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class ChatMessageService
{
    private readonly IMongoCollection<ChatMessage> _messages;

    public ChatMessageService(IConfiguration config)
    {
        var connectionString = config.GetSection("MongoDb:ConnectionString").Value;

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentNullException("MongoDB connection string is missing.");

        var client = new MongoClient(connectionString);
        var db = client.GetDatabase(config.GetSection("MongoDb:DatabaseName").Value);
        _messages = db.GetCollection<ChatMessage>("Messages");
    }


    public async Task SaveMessageAsync(ChatMessage msg) =>
        await _messages.InsertOneAsync(msg);

    public async Task<List<ChatMessage>> GetMessagesInRoomAsync(string roomId)
    {
        return await _messages.Find(m => m.RoomId == roomId)
            .SortBy(m => m.Timestamp)
            .ToListAsync();
    }

}
