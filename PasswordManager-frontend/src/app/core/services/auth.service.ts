import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiUrl}/auth`;

  readonly accessToken = signal<string | null>(null);
  readonly currentUser = signal<User | null>(null);

  private storedRefreshToken: string | null = localStorage.getItem('refreshToken');

  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }

  // Called at app startup — silently restores session from refresh token if present
  tryRestoreSession(): Observable<boolean> {
    if (!this.storedRefreshToken) return of(false);

    return this.http
      .post<AuthTokens>(`${this.base}/refresh`, { refreshToken: this.storedRefreshToken })
      .pipe(
        tap(tokens => this.storeTokens(tokens)),
        tap(() => true),
        catchError(() => {
          this.clearTokens();
          return of(false);
        })
      ) as Observable<boolean>;
  }

  register(email: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.base}/register`, { email, password });
  }

  login(email: string, password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/login`, { email, password }).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  refresh(): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${this.base}/refresh`, { refreshToken: this.storedRefreshToken })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  logout(): void {
    const token = this.storedRefreshToken;
    this.clearTokens();
    if (token) {
      this.http.post(`${this.base}/logout`, { refreshToken: token }).subscribe();
    }
    this.router.navigate(['/login']);
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.base}/me`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  private storeTokens(tokens: AuthTokens): void {
    this.accessToken.set(tokens.accessToken);
    this.storedRefreshToken = tokens.refreshToken;
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.storedRefreshToken = null;
    localStorage.removeItem('refreshToken');
  }
}
