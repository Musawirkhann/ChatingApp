using ChatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ChatingApp.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                        .WithMany(ur => ur.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();

                userRole.HasOne(ur => ur.User)
                       .WithMany(ur => ur.UserRoles)
                       .HasForeignKey(ur => ur.UserId)
                       .IsRequired();
            });

            modelBuilder.Entity<Like>()
                .HasKey(l => new { l.LikerId, l.LikeeId });
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Likee)
                .WithMany(l => l.Likers)
                .HasForeignKey(l => l.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Like>()
                .HasOne(l => l.Liker)
                .WithMany(l => l.Likees)
                .HasForeignKey(l => l.LikerId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Message>()
               .HasOne(m => m.Recipient)
               .WithMany(m => m.MessagesReceived)
               .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);
        }
        public DbSet<Value> Values { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
    }
}