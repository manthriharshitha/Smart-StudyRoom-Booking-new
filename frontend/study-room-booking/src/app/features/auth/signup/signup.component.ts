import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';
import { safeStorage } from '../../../core/storage';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  template: `
  <div style="max-width:480px;margin:36px auto;padding:0 12px;">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex;flex-direction:column;gap:12px;background:#fff;padding:24px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
      <h2 style="margin:0 0 8px 0;font-family:Georgia, 'Times New Roman', serif;">Create account</h2>

      <label style="font-size:1.15rem;color:#333;margin-bottom:4px;">Name</label>
      <input placeholder="Your full name" formControlName="name" style="padding:14px;border:1px solid #ddd;border-radius:6px;font-size:1.15rem;" />

      <label style="font-size:1.15rem;color:#333;margin-bottom:4px;">Email</label>
      <input placeholder="you@example.com" formControlName="email" type="email" style="padding:14px;border:1px solid #ddd;border-radius:6px;font-size:1.15rem;" />

      <label style="font-size:1.15rem;color:#333;margin-bottom:4px;">Password</label>
      <input placeholder="Create a password" formControlName="password" type="password" style="padding:14px;border:1px solid #ddd;border-radius:6px;font-size:1.15rem;" />

      <!-- Role selection restricted to students; admin accounts should be created server-side -->
      <label style="font-size:1.05rem;color:#333;margin-bottom:4px;">Role</label>
      <select formControlName="role" style="padding:10px;border:1px solid #ddd;border-radius:6px;font-size:1.05rem;">
        <option value="student">Student</option>
      </select>

      <button type="submit" [disabled]="form.invalid" style="width:100%;background:#1a73e8;color:#fff;border:none;padding:12px;border-radius:8px;font-weight:700;font-size:1.05rem;cursor:pointer;box-shadow:0 4px 12px rgba(26,115,232,0.24);">Create Account</button>
    </form>
  </div>
  `
})
export class SignupComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }
  onSubmit() {
    if (this.form.invalid) return;
    this.auth.signup(this.form.value as any).subscribe({
      next: (res) => {
  safeStorage.set('token', res.token);
        this.snack.open('Account created', 'Close', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: (err) => this.snack.open(err.error?.error || 'Signup failed', 'Close', { duration: 3000 })
    });
  }
}
