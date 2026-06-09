# PasswordManager — Vault API

ASP.NET Core 9 microservice responsible for storing and retrieving encrypted password entries. Authentication is fully delegated to the ApiGateway — this service never validates a JWT.

## Stack

- **ASP.NET Core 9** — Web API
- **Entity Framework Core 9** + **Pomelo** — MySQL ORM
- **AES-256-GCM** — password encryption at rest

## How identity works

The ApiGateway validates the JWT and injects two trusted headers before forwarding the request:

```
X-User-Id: <sub claim>
X-User-Email: <email claim>
```

Every controller action reads `X-User-Id` to scope database queries. Clients can never forge these headers — the gateway strips any client-provided values on all routes.

## API

All routes are protected at the gateway level (`AuthorizationPolicy: default`).

| Method | Route | Description |
|---|---|---|
| `GET` | `/passwords` | List all entries for the authenticated user |
| `GET` | `/passwords/{id}` | Get a single entry |
| `POST` | `/passwords` | Create a new entry |
| `PUT` | `/passwords/{id}` | Update an entry |
| `DELETE` | `/passwords/{id}` | Delete an entry |

### Request body (POST)

```json
{
  "title": "GitHub",
  "username": "you@example.com",
  "password": "plaintext-password",
  "url": "https://github.com",
  "notes": null,
  "category": "Work",
  "isFavorite": false
}
```

Passwords are **encrypted before being written** to the database and **decrypted on read**. The client always sends and receives plaintext — encryption is transparent and server-side.

### PUT — password field

Send `"password": null` to keep the existing encrypted value unchanged. Send a new string to re-encrypt with a new value.

## Encryption

`EncryptionService` uses **AES-256-GCM**. The 256-bit key is derived from `Encryption:MasterKey` via SHA-256. Each value is encrypted with a unique random nonce stored alongside the ciphertext.

Stored format: `Base64(nonce[12] + tag[16] + ciphertext)`

## Project structure

```
PasswordManager-backend/
├── Controllers/
│   └── PasswordController.cs
├── DTOs/
│   └── PasswordEntryDtos.cs
├── Models/
│   └── PasswordEntry.cs
├── Data/
│   └── AppDbContext.cs
├── Services/
│   └── EncryptionService.cs
├── Migrations/
├── Program.cs
├── appsettings.json          ← tracked, no secrets
└── appsettings.Development.json  ← gitignored, local values
```

## Configuration

### `appsettings.Development.json` (gitignored)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=passwordmanager;user=root;password=root"
  },
  "Encryption": {
    "MasterKey": "dev-master-key-change-in-prod-32chars!!"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

### Production (environment variables)

```
ConnectionStrings__DefaultConnection=<prod-connection-string>
Encryption__MasterKey=<strong-random-secret>
Cors__AllowedOrigins__0=https://yourdomain.com
```

## Running locally

```bash
dotnet run
# Listening on http://localhost:5120
```

Apply migrations on first run:

```bash
dotnet ef database update
```
