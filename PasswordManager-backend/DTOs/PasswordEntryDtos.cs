namespace PasswordManager_backend.DTOs;

public record CreatePasswordEntryDto(
    string Title,
    string Username,
    string Password,
    string? Url,
    string? Notes,
    string? Category,
    bool IsFavorite
);

public record UpdatePasswordEntryDto(
    string Title,
    string Username,
    string? Password,   // null = keep existing encrypted value
    string? Url,
    string? Notes,
    string? Category,
    bool IsFavorite
);

public record PasswordEntryResponseDto(
    Guid Id,
    string Title,
    string Username,
    string Password,    // decrypted on the fly
    string? Url,
    string? Notes,
    string? Category,
    bool IsFavorite,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
