using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Account
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [BsonElement("password")]
        [Required]
        public string Password { get; set; } = string.Empty;

        [BsonElement("role")]
        public string Role { get; set; } = "User"; // "User" or "Admin"

        [BsonElement("petProfileId")]
        public string? PetProfileId { get; set; } // Link to User.Id
    }
}
