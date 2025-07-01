using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userName")]
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 2)]
        public string UserName { get; set; } = string.Empty;

        [BsonElement("age")]
        [Range(0, 30, ErrorMessage = "Age must be between 0 and 30")]
        public int Age { get; set; }

        [BsonElement("petType")]
        [Required(ErrorMessage = "Pet type is required")]
        public string PetType { get; set; } = string.Empty;

        [BsonElement("petPreferences")]
        public List<string> PetPreferences { get; set; } = new();

        [BsonElement("photoPath")]
        [Required]
        public string PhotoPath { get; set; } = string.Empty;

        [BsonElement("location")]
        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; } = string.Empty;

        [BsonElement("likedUsersIds")]
        public List<string> LikedUserIds { get; set; } = new();
        [BsonElement("likedByUsersIds")]
        public List<string> LikedByUserIds { get; set; } = new();

    }
}
