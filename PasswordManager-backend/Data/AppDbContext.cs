using Microsoft.EntityFrameworkCore;
using PasswordManager_backend.Models;

namespace PasswordManagerBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<PasswordEntry> PasswordEntries { get; set; }
    }
}