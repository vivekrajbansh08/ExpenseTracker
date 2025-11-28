import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <i class="fas fa-user-plus fa-3x text-primary mb-3"></i>
          <h2>Create Account</h2>
          <p class="text-muted">Start tracking your expenses today</p>
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="credentials.name"
              name="name"
              required
            />
          </div>

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
            <small class="text-muted">Minimum 6 characters</small>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 mb-3"
            [disabled]="!registerForm.valid || loading"
          >
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>

          <div class="text-center">
            <p class="mb-0">
              Already have an account?
              <a routerLink="/login" class="text-primary">Login</a>
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
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;

  credentials = {
    name: '',
    email: '',
    password: '',
  };
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.registerForm?.valid) {
      this.loading = true;
      this.authService.register(this.credentials).subscribe({
        next: (response) => {
          this.loading = false;
          alert('OTP sent to your email.');
          this.router.navigate(['/verify-otp'], {
            queryParams: { email: this.credentials.email },
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed';
        },
      });
    } else {
      this.errorMessage = 'Please fill all fields correctly';
    }
  }
}
