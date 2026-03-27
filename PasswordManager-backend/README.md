# PasswordManager API

PasswordManager API is a personal backend project that provides a secure password management system.

The system allows users to store and manage credentials through a REST API built with ASP.NET Core Web API, backed by a MySQL database.

---

## System Overview

During normal usage:

1. The user creates an account or logs in
2. Authentication is handled using JWT
3. The user creates password entries (site, username, password)
4. Data is stored in a MySQL database
5. The user retrieves their data through authenticated API calls
6. All operations are restricted to the authenticated user

---

## Backend Platform

Target platform:

- ASP.NET Core Web API
- MySQL database

---

## Software Architecture

The project follows a clean layered architecture to ensure maintainability and scalability.

### Controllers Layer (`Controllers/`)
Handles HTTP requests and routes:

- AuthController (authentication endpoints)
- PasswordController (password management endpoints)

### Services Layer (`Services/`)
Contains business logic:

- AuthService (user authentication and registration)
- PasswordService (CRUD operations for passwords)
- EncryptionService (AES encryption for sensitive data)

### Models Layer (`Models/`)
Defines database entities:

- User
- PasswordEntry

### DTOs Layer (`DTOs/`)
Defines data transfer objects:

- LoginRequest
- RegisterRequest
- PasswordDto

### Data Layer (`Data/`)
Database access layer:

- AppDbContext (Entity Framework Core context)

### Security Layer (`Security/`)
Handles authentication and token generation:

- JwtService (JWT creation and validation)

---

## Project Structure

<pre>
PasswordManager/
│
├─ backend/
│
├─ Controllers/
│ ├─ AuthController.cs
│ └─ PasswordController.cs
│
├─ Services/
│ ├─ AuthService.cs
│ ├─ PasswordService.cs
│ └─ EncryptionService.cs
│
├─ Models/
│ ├─ User.cs
│ └─ PasswordEntry.cs
│
├─ DTOs/
│ ├─ LoginRequest.cs
│ ├─ RegisterRequest.cs
│ └─ PasswordDto.cs
│
├─ Data/
│ └─ AppDbContext.cs
│
├─ Security/
│ └─ JwtService.cs
│
├─ Program.cs
└─ appsettings.json
</pre>

---

## Database Schema

### Users

- Id
- Email
- PasswordHash
- CreatedAt

### PasswordEntries

- Id
- UserId
- Site
- Username
- PasswordEncrypted
- Notes
- CreatedAt

---

## Security

The application follows standard security practices:

- Password hashing using BCrypt
- JWT-based authentication
- HTTPS communication (intended deployment)
- User-based data isolation
- Optional AES encryption for stored passwords

---

## Features

### Authentication
- User registration
- User login
- JWT session management

### Password Management
- Create password entries
- Read user passwords
- Update entries
- Delete entries

### Data Isolation
- Each user can only access their own data

---

## Sources

https://learn.microsoft.com/en-us/aspnet/core/web-api/

https://learn.microsoft.com/en-us/ef/core/

https://dev.mysql.com/doc/

https://jwt.io/introduction/


Microsoft.EntityFrameworkCore
Microsoft.EntityFrameworkCore.Tools
Pomelo.EntityFrameworkCore.MySql
Microsoft.AspNetCore.Authentication.JwtBearer
BCrypt.Net-Next