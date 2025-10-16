import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  template: `
  <div style="max-width:420px;margin:48px auto;">
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="background:#fff;padding:28px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
  <h2 style="margin:0 0 18px 0;font-family:Georgia, 'Times New Roman', serif;">Login</h2>
  <label style="display:block;margin-bottom:10px;font-size:1.2rem;color:#333">Email</label>
  <input placeholder="you@example.com" formControlName="email" type="email" style="width:100%;padding:16px 12px;border:1px solid #ddd;border-radius:6px;background:#fff;margin-bottom:14px;font-size:1.2rem;"/>
  <label style="display:block;margin-bottom:10px;font-size:1.2rem;color:#333">Password</label>
  <input placeholder="Password" formControlName="password" type="password" style="width:100%;padding:16px 12px;border:1px solid #ddd;border-radius:6px;background:#fff;margin-bottom:18px;font-family:'Segoe UI', Roboto, Arial, sans-serif;font-size:1.2rem;letter-spacing:0.4px;"/>
  <button type="submit" [disabled]="form.invalid" style="width:100%;background:#1a73e8;color:#fff;border:none;padding:12px 14px;border-radius:8px;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(26,115,232,0.28);">Sign in</button>
    </form>
  </div>
  `
})
export class LoginComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value as any;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.snack.open('Logged in', 'Close', { duration: 2000 });
        this.router.navigate(['/']);
      },
      error: (err) => this.snack.open(err.error?.error || 'Login failed', 'Close', { duration: 3000 })
    });
  }
}


