using System.Collections.Generic;
using System.Threading.Tasks;
using ChatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatingApp.API.Data
{
    public class ChatingRepository : IChatingRepository
    {
        private readonly DataContext _context;
        public ChatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        // public async Task<Photo> GetPhoto(int Id)
        // {
        //     var photo = await _context.Photos
        // }

        public async Task<User> GetUser(int Id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == Id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(P => P.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}