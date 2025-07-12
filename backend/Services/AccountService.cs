using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson; // This imports ObjectId


namespace backend.Services
{
    public class AccountService
    {
        #region Fields & Constructor
        private readonly IMongoCollection<Account> _accounts;

        public AccountService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _accounts = db.GetCollection<Account>("Accounts");
        }
        #endregion

        #region Create
        public Account Create(Account account)
        {
            _accounts.InsertOne(account);
            return account;
        }

        #endregion

        #region Read
        public List<Account> Get() =>
            _accounts.Find(_ => true).ToList();

        public Account? GetById(string id)
        {
            try
            {
                // Convert the string id to ObjectId
                var objectId = ObjectId.Parse(id); // Converts the string to ObjectId

                // Find account by ObjectId
                return _accounts.Find(a => a.Id == objectId.ToString()).FirstOrDefault();
            }
            catch (FormatException)
            {
                // If the id is not in valid ObjectId format, return null
                return null;
            }
        }

        public Account? GetByEmail(string email) =>
            _accounts.Find(a => a.Email == email).FirstOrDefault();

        public Account? GetByUserId(string userId)
        {
            try
            {
                // Convert userId to ObjectId if it's a valid MongoDB ID
                var objectId = ObjectId.Parse(userId);

                // Find the account where the pet profile matches the userId
                return _accounts.Find(a => a.PetProfileId == userId || a.Id == objectId.ToString()).FirstOrDefault();
            }
            catch (FormatException)
            {
                // If it's not a valid ObjectId, return null
                return null;
            }
        }

        #endregion

        #region Update
        public void UpdatePetProfileId(string accountId, string petProfileId)
        {
            var update = Builders<Account>.Update.Set(a => a.PetProfileId, petProfileId);
            _accounts.UpdateOne(a => a.Id == accountId, update);
        }
        #endregion

        #region Delete
        public DeleteResult DeleteAccount(string id) =>
            _accounts.DeleteOne(a => a.Id == id);
        #endregion
    }
}
