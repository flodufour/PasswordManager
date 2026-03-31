# Password Manager

Simple password manager application with Angular frontend and ASP.NET Core backend using a separated authentication service.

## Architecture

The system is split into multiple services:

- AuthService (ASP.NET Core): handles authentication, JWT issuance, refresh tokens, email verification and password reset
- PasswordManager API (ASP.NET Core): manages user password vault (CRUD operations)
- Frontend (Angular): user interface for authentication and password management

## Features

- User registration and login
- JWT-based authentication
- Refresh token session management
- Secure access to password vault
- Create, read, update and delete stored credentials
- User-specific data isolation

## Backend

- ASP.NET Core Web API
- Entity Framework Core
- MySQL database
- JWT authentication middleware
- BCrypt password hashing (AuthService)

## Frontend

- Angular
- AuthService for authentication handling
- HTTP Interceptors for JWT injection
- Route guards for protected pages
- Vault service for password management API calls

## Security

- JWT authentication for API access
- Refresh token rotation
- Password hashing with BCrypt
- User-based data access control

## API Overview (Password Manager)

- GET /passwords
- POST /passwords
- PUT /passwords/{id}
- DELETE /passwords/{id}

All endpoints require valid JWT authentication.

## Notes

- AuthService is fully separated from the password manager service
- Password Manager API does not handle authentication logic
- Communication is done via JWT tokens issued by AuthService