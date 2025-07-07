using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class UserService
    {
        #region Fields & Constructor
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>(settings.Value.UsersCollectionName);
        }
        #endregion

        #region Create
        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }
        #endregion

        #region Read
        public List<User> Get() =>
            _users.Find(user => true).ToList();

        public User Get(string id) =>
            _users.Find(user => user.Id == id).FirstOrDefault();

        public IMongoCollection<User> GetCollection() =>
            _users;
        #endregion

        #region Update
        public void Update(string id, User userIn) =>
            _users.ReplaceOne(u => u.Id == id, userIn);
        #endregion

        #region Delete
        public DeleteResult DeleteUser(string id) =>
            _users.DeleteOne(u => u.Id == id);

        public async Task RemoveLikesFromOthersAsync(string deletedUserId)
        {
            var filterLiked = Builders<User>.Filter.AnyEq(u => u.LikedUserIds, deletedUserId);
            var updateLiked = Builders<User>.Update.Pull(u => u.LikedUserIds, deletedUserId);

            var filterLikedBy = Builders<User>.Filter.AnyEq(u => u.LikedByUserIds, deletedUserId);
            var updateLikedBy = Builders<User>.Update.Pull(u => u.LikedByUserIds, deletedUserId);

            await _users.UpdateManyAsync(filterLiked, updateLiked);
            await _users.UpdateManyAsync(filterLikedBy, updateLikedBy);
        }
        #endregion

        #region Like / Unheart Logic
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

            // Return whether it's a match (both like each other)
            return liked.LikedUserIds.Contains(likerId);
        }

        public bool UnheartUser(string likerId, string likedId)
        {
            var liker = _users.Find(u => u.Id == likerId).FirstOrDefault();
            var liked = _users.Find(u => u.Id == likedId).FirstOrDefault();

            if (liker == null || liked == null)
                return false;

            // Remove likedId from liker’s likedUserIds
            if (liker.LikedUserIds != null)
            {
                liker.LikedUserIds.Remove(likedId);
                _users.ReplaceOne(u => u.Id == likerId, liker);
            }

            // Remove likerId from liked’s likedByUserIds
            if (liked.LikedByUserIds != null)
            {
                liked.LikedByUserIds.Remove(likerId);
                _users.ReplaceOne(u => u.Id == likedId, liked);
            }

            return true;
        }
        #endregion
    }
}
