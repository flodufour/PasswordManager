namespace PasswordManager_backend.Models
{
    public class PasswordEntry
    {
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string EncryptedPassword { get; set; } = string.Empty;

        public string? Url { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public string? Category { get; set; }

        public bool IsFavorite { get; set; }

    }
}
