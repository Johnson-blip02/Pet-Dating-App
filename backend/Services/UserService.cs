using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>(settings.Value.UsersCollectionName);
        }

        public List<User> Get() => _users.Find(user => true).ToList();
        public User Get(string id) => _users.Find(user => user.Id == id).FirstOrDefault();
        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }
        public void Update(string id, User userIn) => _users.ReplaceOne(u => u.Id == id, userIn);
        public void Remove(string id) => _users.DeleteOne(u => u.Id == id);

        public bool LikeUser(string likerId, string likedId)
        {
        var liker = _users.Find(u => u.Id == likerId).FirstOrDefault();
        var liked = _users.Find(u => u.Id == likedId).FirstOrDefault();

        if (liker == null || liked == null) return false;

        // Add likedId to liker
        if (!liker.LikedUserIds.Contains(likedId))
        {
            liker.LikedUserIds.Add(likedId);
            Update(likerId, liker);
        }

        // Add likerId to liked
        if (!liked.LikedByUserIds.Contains(likerId))
        {
            liked.LikedByUserIds.Add(likerId);
            Update(likedId, liked);
        }

        return liked.LikedUserIds.Contains(likerId);
        }


    public IMongoCollection<User> GetCollection()
        {
            return _users;
        }

    }
}
