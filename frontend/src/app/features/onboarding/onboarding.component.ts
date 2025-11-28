import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="onboarding-container">
      <div class="onboarding-content" [class.slide-out]="isExiting">
        <!-- Logo & Header -->
        <div class="onboarding-header">
          <div class="logo-wrapper">
            <i class="fas fa-wallet"></i>
            <h1>MoneyTrack</h1>
          </div>
          <p class="tagline">Your Personal Finance Companion</p>
        </div>

        <!-- Step Indicators -->
        <div class="step-indicators">
          <div
            *ngFor="let step of steps; let i = index"
            class="step-indicator"
            [class.active]="currentStep === i"
            [class.completed]="currentStep > i"
          >
            <div class="step-circle">
              <i *ngIf="currentStep > i" class="fas fa-check"></i>
              <span *ngIf="currentStep <= i">{{ i + 1 }}</span>
            </div>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content" [@fadeIn]>
          <!-- Step 1: Welcome -->
          <div *ngIf="currentStep === 0" class="step welcome-step">
            <div class="illustration">
              <i class="fas fa-rocket fa-5x"></i>
            </div>
            <h2>Welcome to MoneyTrack!</h2>
            <p>
              Take control of your finances with ease. Track expenses, set budgets, and achieve your
              financial goals.
            </p>
            <div class="features-grid">
              <div class="feature">
                <i class="fas fa-chart-line"></i>
                <span>Visual Analytics</span>
              </div>
              <div class="feature">
                <i class="fas fa-piggy-bank"></i>
                <span>Budget Planning</span>
              </div>
              <div class="feature">
                <i class="fas fa-bell"></i>
                <span>Smart Alerts</span>
              </div>
              <div class="feature">
                <i class="fas fa-mobile-alt"></i>
                <span>Multi-Device</span>
              </div>
            </div>
          </div>

          <!-- Step 2: Features -->
          <div *ngIf="currentStep === 1" class="step features-step">
            <div class="illustration">
              <i class="fas fa-chart-pie fa-5x"></i>
            </div>
            <h2>Powerful Features</h2>
            <p>Everything you need to manage your money effectively</p>
            <div class="features-list">
              <div class="feature-item">
                <i class="fas fa-exchange-alt"></i>
                <div>
                  <h4>Track Transactions</h4>
                  <p>Record income and expenses effortlessly</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="fas fa-chart-bar"></i>
                <div>
                  <h4>Visual Reports</h4>
                  <p>Understand your spending patterns with charts</p>
                </div>
              </div>
              <div class="feature-item">
                <i class="fas fa-calculator"></i>
                <div>
                  <h4>Budget Management</h4>
                  <p>Set limits and stay within your budget</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Get Started -->
          <div *ngIf="currentStep === 2" class="step ready-step">
            <div class="illustration">
              <i class="fas fa-flag-checkered fa-5x"></i>
            </div>
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who have taken control of their finances with MoneyTrack!</p>
            <div class="stats-grid">
              <div class="stat">
                <div class="stat-value">10k+</div>
                <div class="stat-label">Active Users</div>
              </div>
              <div class="stat">
                <div class="stat-value">₹1M+</div>
                <div class="stat-label">Money Tracked</div>
              </div>
              <div class="stat">
                <div class="stat-value">4.8★</div>
                <div class="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="onboarding-actions">
          <button *ngIf="currentStep > 0" class="btn btn-outline" (click)="previousStep()">
            <i class="fas fa-arrow-left me-2"></i>
            Back
          </button>

          <button
            *ngIf="currentStep < steps.length - 1"
            class="btn btn-primary"
            (click)="nextStep()"
          >
            Next
            <i class="fas fa-arrow-right ms-2"></i>
          </button>

          <button
            *ngIf="currentStep === steps.length - 1"
            class="btn btn-primary btn-lg"
            (click)="completeOnboarding()"
          >
            Get Started
            <i class="fas fa-rocket ms-2"></i>
          </button>
        </div>

        <!-- Skip Button -->
        <button class="skip-btn" (click)="skip()">Skip for now</button>
      </div>

      <!-- Background Decorations -->
      <div class="bg-decoration decoration-1"></div>
      <div class="bg-decoration decoration-2"></div>
      <div class="bg-decoration decoration-3"></div>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .onboarding-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
        padding: 2rem;
      }

      .onboarding-content {
        max-width: 800px;
        width: 100%;
        background: white;
        border-radius: 24px;
        padding: 3rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 10;
        animation: fadeIn 0.6s ease;
      }

      .onboarding-content.slide-out {
        animation: slideOut 0.4s ease forwards;
      }

      @keyframes slideOut {
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }

      /* Header */
      .onboarding-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .logo-wrapper i {
        font-size: 3rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .logo-wrapper h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .tagline {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin: 0;
      }

      /* Step Indicators */
      .step-indicators {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .step-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        position: relative;
      }

      .step-indicator::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 50%;
        width: 100%;
        height: 2px;
        background: var(--border-color);
        z-index: -1;
      }

      .step-indicator:last-child::before {
        display: none;
      }

      .step-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: var(--text-secondary);
        transition: all 0.3s ease;
      }

      .step-indicator.active .step-circle {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: white;
        transform: scale(1.1);
      }

      .step-indicator.completed .step-circle {
        background: var(--success-color);
        border-color: var(--success-color);
        color: white;
      }

      .step-label {
        font-size: 0.875rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .step-indicator.active .step-label {
        color: var(--primary-color);
        font-weight: 600;
      }

      /* Step Content */
      .step-content {
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.5s ease;
      }

      .step {
        width: 100%;
        text-align: center;
      }

      .illustration {
        margin-bottom: 2rem;
        color: var(--primary-color);
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .step h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
      }

      .step p {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }

      /* Features Grid */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .feature {
        padding: 1.5rem;
        background: var(--bg-color);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        transition: all 0.3s ease;
      }

      .feature:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-5px);
      }

      .feature i {
        font-size: 2rem;
      }

      .feature span {
        font-weight: 600;
      }

      /* Features List */
      .features-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        text-align: left;
        max-width: 500px;
        margin: 0 auto;
      }

      .feature-item {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        background: var(--bg-color);
        border-radius: 12px;
        transition: all 0.3s ease;
      }

      .feature-item:hover {
        box-shadow: var(--shadow-md);
        transform: translateX(10px);
      }

      .feature-item i {
        font-size: 2rem;
        color: var(--primary-color);
        flex-shrink: 0;
      }

      .feature-item h4 {
        margin: 0 0 0.25rem 0;
        color: var(--text-primary);
      }

      .feature-item p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-muted);
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-top: 2rem;
      }

      .stat {
        padding: 1.5rem;
        background: var(--bg-color);
        border-radius: 12px;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      /* Actions */
      .onboarding-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 3rem;
      }

      .btn {
        padding: 0.875rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
      }

      .btn-outline {
        background: transparent;
        border: 2px solid var(--border-color);
        color: var(--text-primary);
      }

      .btn-outline:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      .btn-lg {
        padding: 1.125rem 2.5rem;
        font-size: 1.125rem;
      }

      .skip-btn {
        display: block;
        margin: 1.5rem auto 0;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 0.875rem;
        transition: color 0.3s ease;
      }

      .skip-btn:hover {
        color: var(--text-primary);
      }

      /* Background Decorations */
      .bg-decoration {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        z-index: 1;
      }

      .decoration-1 {
        width: 400px;
        height: 400px;
        top: -200px;
        left: -200px;
        animation: float 6s ease-in-out infinite;
      }

      .decoration-2 {
        width: 300px;
        height: 300px;
        bottom: -150px;
        right: -150px;
        animation: float 8s ease-in-out infinite reverse;
      }

      .decoration-3 {
        width: 200px;
        height: 200px;
        top: 50%;
        right: -100px;
        animation: float 10s ease-in-out infinite;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .onboarding-content {
          padding: 2rem;
        }

        .logo-wrapper h1 {
          font-size: 2rem;
        }

        .step-indicators {
          gap: 1rem;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          font-size: 0.875rem;
        }

        .features-grid,
        .stats-grid {
          grid-template-columns: 1fr;
        }

        .onboarding-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class OnboardingComponent {
  currentStep = 0;
  isExiting = false;

  steps = [{ label: 'Welcome' }, { label: 'Features' }, { label: 'Get Started' }];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  completeOnboarding(): void {
    this.isExiting = true;
    setTimeout(() => {
      localStorage.setItem('onboarding_completed', 'true');

      // Check if user is already logged in
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/register']);
      }
    }, 400);
  }

  skip(): void {
    if (confirm('Skip to login?')) {
      this.router.navigate(['/login']);
    }
  }
}
