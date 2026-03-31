# PasswordManager Backend

PasswordManager is a secure backend service built with ASP.NET Core Web API for managing user password vaults. It works alongside a dedicated AuthService that handles authentication, JWT issuance, and session management.

This service is responsible only for password storage and retrieval, while authentication is fully delegated to the external AuthService.

---

## System Overview

The PasswordManager backend is a stateless API that manages encrypted or structured user credentials.

1. User authenticates through AuthService
2. AuthService issues a JWT access token
3. Client sends JWT with each request
4. PasswordManager validates JWT signature
5. User identity is extracted from token claims
6. User performs CRUD operations on password vault
7. Data is isolated per user

---

## System Responsibilities

- Manage password vault entries per user
- Provide secure CRUD operations
- Enforce user data isolation via JWT claims
- Validate access tokens (JWT)
- Expose REST API for frontend consumption

---

## Architecture

The project follows a clean layered architecture similar to modern .NET backend systems.

### Core Layer (`Core/`)
Contains business logic independent of infrastructure:

- Password entry domain model
- Vault management logic
- Encryption/decryption logic (optional extension)

---

### Interfaces Layer (`Interfaces/`)
Defines abstraction contracts for:

- Password repository
- Vault service
- Encryption service (optional)

These interfaces allow implementation swapping without affecting business logic.

---

### Services Layer (`Services/`)
Contains business logic implementations:

- PasswordVaultService
- PasswordService (CRUD logic)
- EncryptionService (optional)

Responsible for handling vault operations and enforcing rules.

---

### Data Layer (`Data/`)
Handles database access:

- AppDbContext
- Entity Framework Core configurations
- Password entity persistence

---

### Controllers Layer (`Controllers/`)

- PasswordController

Exposes REST endpoints:

- GET /passwords
- POST /passwords
- PUT /passwords/{id}
- DELETE /passwords/{id}

All endpoints require authenticated JWT access.

---

### Security Layer (`Security/`)
Handles authentication integration:

- JWT validation middleware
- Token parsing utilities
- User claim extraction

This layer ensures secure access to user-specific data.

---

## Project Structure

<pre>PasswordManagerBackend/
│
├─ Controllers/
│   └─ PasswordController.cs
│
├─ Interfaces/
│   ├─ IPasswordService.cs
│   ├─ IPasswordRepository.cs
│   └─ IVaultService.cs
│
├─ Services/
│   ├─ PasswordService.cs
│   ├─ PasswordVaultService.cs
│   └─ EncryptionService.cs
│
├─ Models/
│   └─ PasswordEntry.cs
│
├─ Data/
│   └─ AppDbContext.cs
│
├─ Security/
│   ├─ JwtMiddleware.cs
│   ├─ JwtValidator.cs
│   └─ ClaimsExtractor.cs
│
├─ DTOs/
│   ├─ PasswordCreateRequest.cs
│   ├─ PasswordUpdateRequest.cs
│   └─ PasswordResponse.cs
│
├─ Program.cs
└─ appsettings.json
</pre>

---

## Authentication Flow

### Request Handling

1. Client sends request with JWT in Authorization header
2. Middleware validates JWT signature
3. Claims are extracted (UserId)
4. Request is processed in controller
5. Service layer applies business rules
6. Database operation is executed

---

### Data Isolation

Each password entry is linked to a specific user:

- UserId is extracted from JWT claims
- All queries are filtered by UserId
- Users cannot access other users' data

---

## Security

- JWT-based authentication (delegated to AuthService)
- Token signature validation
- User-based access control
- Secure password storage model
- Optional encryption layer for stored credentials

---

## API Overview

### Password Vault

- GET /passwords → Get all passwords for current user
- POST /passwords → Create new password entry
- PUT /passwords/{id} → Update password entry
- DELETE /passwords/{id} → Delete password entry

---

## Integration with AuthService

This backend does not handle authentication logic.

It relies on:

- JWT tokens issued by AuthService
- User identity embedded in token claims
- External session management via refresh tokens

---

## Notes

- AuthService is fully separated and independent
- PasswordManager backend only handles vault operations
- JWT validation is stateless and performed locally
- Designed for scalability and microservice architecture