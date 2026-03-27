namespace PasswordManager_backend.Models
{
    public class PasswordEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Site { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordEncrypted { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}