using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PasswordManager_backend.DTOs;
using PasswordManager_backend.Models;
using PasswordManager_backend.Services;
using PasswordManagerBackend.Data;

namespace PasswordManager_backend.Controllers;

[ApiController]
[Route("passwords")]
public class PasswordController(AppDbContext db, EncryptionService encryption) : ControllerBase
{
    private string UserId => Request.Headers["X-User-Id"].FirstOrDefault()
        ?? throw new UnauthorizedAccessException("Missing X-User-Id header.");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var entries = await db.PasswordEntries
            .Where(e => e.UserId == UserId)
            .OrderBy(e => e.Title)
            .ToListAsync();

        return Ok(entries.Select(ToDto));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var entry = await db.PasswordEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == UserId);

        return entry is null ? NotFound() : Ok(ToDto(entry));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePasswordEntryDto dto)
    {
        var entry = new PasswordEntry
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Title = dto.Title,
            Username = dto.Username,
            EncryptedPassword = encryption.Encrypt(dto.Password),
            Url = dto.Url,
            Notes = dto.Notes,
            Category = dto.Category,
            IsFavorite = dto.IsFavorite,
            CreatedAt = DateTime.UtcNow
        };

        db.PasswordEntries.Add(entry);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, ToDto(entry));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePasswordEntryDto dto)
    {
        var entry = await db.PasswordEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == UserId);

        if (entry is null)
            return NotFound();

        entry.Title = dto.Title;
        entry.Username = dto.Username;
        if (dto.Password is not null)
            entry.EncryptedPassword = encryption.Encrypt(dto.Password);
        entry.Url = dto.Url;
        entry.Notes = dto.Notes;
        entry.Category = dto.Category;
        entry.IsFavorite = dto.IsFavorite;
        entry.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(ToDto(entry));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entry = await db.PasswordEntries
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == UserId);

        if (entry is null)
            return NotFound();

        db.PasswordEntries.Remove(entry);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private PasswordEntryResponseDto ToDto(PasswordEntry e) => new(
        e.Id,
        e.Title,
        e.Username,
        encryption.Decrypt(e.EncryptedPassword),
        e.Url,
        e.Notes,
        e.Category,
        e.IsFavorite,
        e.CreatedAt,
        e.UpdatedAt
    );
}
