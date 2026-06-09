# Password Manager

A simple, secure password vault built on a microservice architecture.

## Architecture

```
Browser (Angular)
    │
    ▼
ApiGateway  :5248       ← single entry point, JWT validation, rate limiting
    │
    ├── /auth/**  ──►  AuthService        :5121  (registration, login, tokens)
    └── /passwords/**  ►  PasswordManager  :5120  (vault CRUD, AES-256-GCM)
```

- The gateway is the **only** public endpoint. Downstream services are never exposed directly.
- JWT is validated once at the gateway. The vault service receives a trusted `X-User-Id` header — it never sees or parses a token.
- Passwords are encrypted at rest with AES-256-GCM using a server-side master key.

## Services

| Service | Tech | Port | README |
|---|---|---|---|
| ApiGateway | ASP.NET Core 9 + YARP | 5248 | `ApiGateway/` |
| AuthService | ASP.NET Core 9 | 5121 | `AuthService/` |
| PasswordManager (API) | ASP.NET Core 9 + EF Core + MySQL | 5120 | `PasswordManager-backend/` |
| PasswordManager (UI) | Angular 20 | 4200 | `PasswordManager-frontend/` |

## Running locally

Start each service in order:

```bash
# 1. AuthService
cd AuthService/src && dotnet run

# 2. PasswordManager backend
cd PasswordManager-backend && dotnet run

# 3. ApiGateway
cd ApiGateway/src && dotnet run

# 4. Frontend
cd PasswordManager-frontend && ng serve
```

Open `http://localhost:4200`.

## Security overview

| Concern | Solution |
|---|---|
| Authentication | JWT RS256 issued by AuthService, validated by gateway via JWKS |
| Password storage | AES-256-GCM, key derived from `Encryption:MasterKey` |
| Identity forgery | Gateway strips `X-User-Id` / `X-User-Email` on every inbound request |
| Session | Short-lived access token (memory) + rotating refresh token (localStorage) |
| Rate limiting | 300 req/min per IP at the gateway |

## Production checklist

- [ ] Set `Encryption__MasterKey` as an environment variable (never in a committed file)
- [ ] Set `ConnectionStrings__DefaultConnection` as an environment variable
- [ ] Update `Auth__Authority` to the production AuthService HTTPS URL
- [ ] Set `Cors__AllowedOrigins__0` to the production frontend domain
- [ ] Replace `apiUrl` in `environment.prod.ts` with the production gateway URL
- [ ] Enforce HTTPS on all services
