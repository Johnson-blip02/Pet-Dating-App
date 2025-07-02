using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

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

        public Account? GetById(string id) =>
            _accounts.Find(a => a.Id == id).FirstOrDefault();

        public Account? GetByEmail(string email) =>
            _accounts.Find(a => a.Email == email).FirstOrDefault();
        #endregion

        #region Update
        public void UpdatePetProfileId(string accountId, string petProfileId)
        {
            var update = Builders<Account>.Update.Set(a => a.PetProfileId, petProfileId);
            _accounts.UpdateOne(a => a.Id == accountId, update);
        }
        #endregion

        #region Delete
        public void Delete(string id) =>
            _accounts.DeleteOne(a => a.Id == id);
        #endregion
    }
}
