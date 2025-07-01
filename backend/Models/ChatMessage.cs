using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace backend.Models;

public class ChatMessage
{
    // MongoDB ID (stored as ObjectId) ↔ API exposes as string
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    // Both MongoDB and API use the same field name
    [BsonElement("roomId")]
    [JsonPropertyName("roomId")]
    public string RoomId { get; set; } = string.Empty;

    [BsonElement("senderId")]
    [JsonPropertyName("senderId")]
    public string SenderId { get; set; } = string.Empty;

    [BsonElement("receiverId")]
    [JsonPropertyName("receiverId")]
    public string ReceiverId { get; set; } = string.Empty;

    [BsonElement("message")]
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    // DateTime handling (MongoDB stores as UTC, API returns ISO string)
    [BsonElement("timestamp")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}