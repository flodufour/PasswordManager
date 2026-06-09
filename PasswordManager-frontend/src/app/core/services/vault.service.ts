import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  category: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePasswordEntryDto {
  title: string;
  username: string;
  password: string;
  url: string | null;
  notes: string | null;
  category: string | null;
  isFavorite: boolean;
}

export interface UpdatePasswordEntryDto {
  title: string;
  username: string;
  password: string | null;
  url: string | null;
  notes: string | null;
  category: string | null;
  isFavorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class VaultService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/passwords`;

  getAll(): Observable<PasswordEntry[]> {
    return this.http.get<PasswordEntry[]>(this.base);
  }

  getById(id: string): Observable<PasswordEntry> {
    return this.http.get<PasswordEntry>(`${this.base}/${id}`);
  }

  create(dto: CreatePasswordEntryDto): Observable<PasswordEntry> {
    return this.http.post<PasswordEntry>(this.base, dto);
  }

  update(id: string, dto: UpdatePasswordEntryDto): Observable<PasswordEntry> {
    return this.http.put<PasswordEntry>(`${this.base}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
