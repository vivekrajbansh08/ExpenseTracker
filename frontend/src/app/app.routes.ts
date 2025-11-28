import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { VerifyOtpComponent } from './features/auth/verify-otp/verify-otp';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/onboarding',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'verify-otp',
    component: VerifyOtpComponent,
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./features/transactions/transaction-list/transaction-list.component').then(
        (m) => m.TransactionListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'budget',
    loadComponent: () =>
      import('./features/budget/budget.component').then((m) => m.BudgetComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/onboarding',
  },
];
