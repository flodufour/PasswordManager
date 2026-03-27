namespace PasswordManager_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<PasswordEntry> PasswordEntries { get; set; } = new List<PasswordEntry>();

    }
}
