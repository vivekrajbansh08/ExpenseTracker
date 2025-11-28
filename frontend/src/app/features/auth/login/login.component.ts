import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <i class="fas fa-wallet fa-3x text-primary mb-3"></i>
          <h2>Welcome Back</h2>
          <p class="text-muted">Login to manage your expenses</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              [(ngModel)]="credentials.email"
              name="email"
              required
              email
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="credentials.password"
              name="password"
              required
              minlength="6"
            />
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 mb-3"
            [disabled]="!loginForm.valid || loading"
          >
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="text-center">
            <p class="mb-0">
              Don't have an account?
              <a routerLink="/register" class="text-primary">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }
      .auth-card {
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Mark onboarding as completed
        localStorage.setItem('onboarding_completed', 'true');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}
