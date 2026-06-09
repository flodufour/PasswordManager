import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PasswordEntry, VaultService } from '../../../core/services/vault.service';

@Component({
  selector: 'app-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
})
export class PasswordFormComponent implements OnInit {
  @Input() entry: PasswordEntry | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly vault = inject(VaultService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    title: [''],
    username: [''],
    password: [''],
    url: [''],
    notes: [''],
    category: [''],
    isFavorite: [false],
  });

  readonly showPassword = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  get isEdit(): boolean {
    return this.entry !== null;
  }

  ngOnInit(): void {
    if (this.entry) {
      this.form.patchValue({
        title: this.entry.title,
        username: this.entry.username,
        password: this.entry.password,
        url: this.entry.url ?? '',
        notes: this.entry.notes ?? '',
        category: this.entry.category ?? '',
        isFavorite: this.entry.isFavorite,
      });
    }
  }

  generatePassword(): void {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    const generated = Array.from(array, b => chars[b % chars.length]).join('');
    this.form.patchValue({ password: generated });
    this.showPassword.set(true);
  }

  submit(): void {
    const v = this.form.getRawValue();
    if (!v.title || !v.username || !v.password) {
      this.error.set('Title, username and password are required.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const obs = this.isEdit
      ? this.vault.update(this.entry!.id, {
          title: v.title,
          username: v.username,
          password: v.password !== this.entry!.password ? v.password : null,
          url: v.url || null,
          notes: v.notes || null,
          category: v.category || null,
          isFavorite: v.isFavorite,
        })
      : this.vault.create({
          title: v.title,
          username: v.username,
          password: v.password,
          url: v.url || null,
          notes: v.notes || null,
          category: v.category || null,
          isFavorite: v.isFavorite,
        });

    obs.subscribe({
      next: () => this.saved.emit(),
      error: () => {
        this.error.set('Failed to save. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
