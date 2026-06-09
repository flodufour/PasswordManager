import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordEntry, VaultService } from '../../core/services/vault.service';
import { AuthService } from '../../core/services/auth.service';
import { PasswordFormComponent } from './password-form/password-form.component';

@Component({
  selector: 'app-vault',
  standalone: true,
  imports: [PasswordFormComponent],
  templateUrl: './vault.component.html',
  styleUrl: './vault.component.scss',
})
export class VaultComponent implements OnInit {
  private readonly vault = inject(VaultService);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly entries = signal<PasswordEntry[]>([]);
  readonly search = signal('');
  readonly showForm = signal(false);
  readonly editEntry = signal<PasswordEntry | null>(null);
  readonly revealedIds = signal<Set<string>>(new Set());
  readonly loading = signal(true);

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.entries().filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.username.toLowerCase().includes(q) ||
        (e.url ?? '').toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.vault.getAll().subscribe({
      next: entries => {
        this.entries.set(entries);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    this.editEntry.set(null);
    this.showForm.set(true);
  }

  openEdit(entry: PasswordEntry): void {
    this.editEntry.set(entry);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editEntry.set(null);
  }

  onSaved(): void {
    this.closeForm();
    this.load();
  }

  delete(entry: PasswordEntry): void {
    if (!confirm(`Delete "${entry.title}"?`)) return;
    this.vault.delete(entry.id).subscribe(() => this.load());
  }

  toggleReveal(id: string): void {
    this.revealedIds.update(ids => {
      const copy = new Set(ids);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }

  isRevealed(id: string): boolean {
    return this.revealedIds().has(id);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  logout(): void {
    this.auth.logout();
  }
}
