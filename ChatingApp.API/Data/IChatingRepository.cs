using System.Threading.Tasks;
using System.Collections.Generic;
using ChatingApp.API.Models;
using ChatingApp.API.Helpers;

namespace ChatingApp.API.Data
{
    public interface IChatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(UserParams userParams);
        //Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int Id, bool isCurrentUser);
        Task<Photo> GetPhoto(int Id);
        Task<Photo> GetMainPhotoForUser(int userId);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
    }
}