using System.Threading.Tasks;
using System.Collections.Generic;
using ChatingApp.API.Models;

namespace ChatingApp.API.Data
{
    public interface IChatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int Id);
        //Task<Photo> GetPhoto(int Id);
    }
}