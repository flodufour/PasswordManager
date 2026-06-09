using System.Security.Cryptography;
using System.Text;

namespace PasswordManager_backend.Services;

public class EncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration config)
    {
        var masterKey = config["Encryption:MasterKey"]
            ?? throw new InvalidOperationException("Encryption:MasterKey must be configured.");

        // Derive a stable 256-bit key from the master key string via SHA-256
        _key = SHA256.HashData(Encoding.UTF8.GetBytes(masterKey));
    }

    // Stored format: nonce(12) + tag(16) + ciphertext — Base64-encoded
    public string Encrypt(string plaintext)
    {
        var nonce = new byte[12];
        RandomNumberGenerator.Fill(nonce);

        var plaintextBytes = Encoding.UTF8.GetBytes(plaintext);
        var ciphertext = new byte[plaintextBytes.Length];
        var tag = new byte[16];

        using var aes = new AesGcm(_key, 16);
        aes.Encrypt(nonce, plaintextBytes, ciphertext, tag);

        var blob = new byte[12 + 16 + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, blob, 0, 12);
        Buffer.BlockCopy(tag, 0, blob, 12, 16);
        Buffer.BlockCopy(ciphertext, 0, blob, 28, ciphertext.Length);

        return Convert.ToBase64String(blob);
    }

    public string Decrypt(string encryptedBase64)
    {
        var blob = Convert.FromBase64String(encryptedBase64);
        var nonce = blob[..12];
        var tag = blob[12..28];
        var ciphertext = blob[28..];
        var plaintext = new byte[ciphertext.Length];

        using var aes = new AesGcm(_key, 16);
        aes.Decrypt(nonce, ciphertext, tag, plaintext);

        return Encoding.UTF8.GetString(plaintext);
    }
}
