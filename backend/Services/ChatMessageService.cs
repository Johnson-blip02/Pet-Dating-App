// Services/ChatMessageService.cs
using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class ChatMessageService
{
    #region Fields & Constructor
    private readonly IMongoCollection<ChatMessage> _messages;

    public ChatMessageService(IConfiguration config)
    {
        var connectionString = config.GetSection("MongoDb:ConnectionString").Value;

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentNullException("MongoDB connection string is missing.");

        var dbName = config.GetSection("MongoDb:DatabaseName").Value;
        var client = new MongoClient(connectionString);
        var db = client.GetDatabase(dbName);

        _messages = db.GetCollection<ChatMessage>("Messages");
    }
    #endregion

    #region Create
    public async Task SaveMessageAsync(ChatMessage msg) =>
        await _messages.InsertOneAsync(msg);
    #endregion

    #region Read
    public async Task<List<ChatMessage>> GetMessagesInRoomAsync(string roomId)
    {
        return await _messages.Find(m => m.RoomId == roomId)
                              .SortBy(m => m.Timestamp)
                              .ToListAsync();
    }
    #endregion

    #region Delete
    public async Task<long> DeleteMessagesInRoomAsync(string roomId)
    {
        var result = await _messages.DeleteManyAsync(msg => msg.RoomId == roomId);
        return result.DeletedCount;
    }
    #endregion
}
