# PasswordManager — Frontend

Angular 20 single-page application for the password vault. All API calls go through the ApiGateway.

## Stack

- **Angular 20** — standalone components, zoneless change detection
- **Signals** — reactive state (`signal`, `computed`)
- **Reactive Forms** — login, register, password form
- **HttpClient** + functional interceptor — automatic JWT injection and token refresh

## Features

- Register / login / logout
- Session restored on page reload via refresh token
- List, search, create, edit, delete password entries
- Reveal / hide stored passwords
- One-click copy to clipboard
- Built-in password generator (cryptographically random, 20 chars)
- Favorite flag and category label per entry
- Dark theme

## Project structure

```
src/
├── environments/
│   ├── environment.ts          ← dev (apiUrl: http://localhost:5248)
│   └── environment.prod.ts     ← prod (apiUrl: https://your-gateway-domain.com)
└── app/
    ├── core/
    │   ├── services/
    │   │   ├── auth.service.ts     ← login, register, logout, refresh, session restore
    │   │   └── vault.service.ts    ← CRUD for password entries
    │   ├── interceptors/
    │   │   └── auth.interceptor.ts ← injects Bearer token, retries on 401
    │   └── guards/
    │       └── auth.guard.ts       ← redirects to /login if unauthenticated
    ├── features/
    │   ├── auth/
    │   │   ├── login/
    │   │   └── register/
    │   └── vault/
    │       ├── vault.component.*       ← main vault view
    │       └── password-form/          ← create / edit modal
    ├── app.routes.ts      ← lazy-loaded routes with auth guard
    ├── app.config.ts      ← providers: router, HttpClient, interceptor, APP_INITIALIZER
    └── app.html
```

## Authentication flow

1. **Login** → access token stored in memory (`signal`), refresh token in `localStorage`
2. **Page reload** → `APP_INITIALIZER` calls `/auth/refresh`, restores access token silently
3. **401 response** → interceptor auto-retries after a token refresh, logs out on failure
4. **Logout** → revokes refresh token server-side, clears `localStorage`

The access token is intentionally kept in memory only (never `localStorage`) to reduce XSS exposure.

## Running locally

```bash
npm install
ng serve
# Open http://localhost:4200
```

The app expects the ApiGateway at `http://localhost:5248` (see `environment.ts`).

## Production build

```bash
ng build
# Output: dist/PasswordManager-frontend/
```

The production build uses `environment.prod.ts`. Update `apiUrl` there before building:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-gateway-domain.com',
};
```
