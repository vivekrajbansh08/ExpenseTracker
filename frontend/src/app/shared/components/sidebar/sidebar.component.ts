import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DarkModeService } from '../../../core/services/dark-mode.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-wallet"></i>
          <span class="logo-text" *ngIf="!isCollapsed">MoneyTrack</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i
            class="fas"
            [class.fa-chevron-left]="!isCollapsed"
            [class.fa-chevron-right]="isCollapsed"
          ></i>
        </button>
      </div>

      <!-- User Info -->
      <div class="user-info" *ngIf="currentUser">
        <div class="user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="user-details" *ngIf="!isCollapsed">
          <div class="user-name">{{ currentUser.name }}</div>
          <div class="user-email">{{ currentUser.email }}</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <a
          routerLink="/dashboard"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Dashboard' : ''"
        >
          <i class="fas fa-chart-line"></i>
          <span *ngIf="!isCollapsed">Dashboard</span>
        </a>

        <a
          routerLink="/wallets"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Wallets' : ''"
        >
          <i class="fas fa-wallet"></i>
          <span *ngIf="!isCollapsed">Wallets</span>
        </a>

        <a
          routerLink="/transactions"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Transactions' : ''"
        >
          <i class="fas fa-exchange-alt"></i>
          <span *ngIf="!isCollapsed">Transactions</span>
        </a>

        <a
          routerLink="/budget"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Budget' : ''"
        >
          <i class="fas fa-piggy-bank"></i>
          <span *ngIf="!isCollapsed">Budget</span>
        </a>

        <a
          routerLink="/subscriptions"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Subscriptions' : ''"
        >
          <i class="fas fa-calendar-check"></i>
          <span *ngIf="!isCollapsed">Subscriptions</span>
        </a>

        <a
          routerLink="/savings-goals"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Savings Goals' : ''"
        >
          <i class="fas fa-bullseye"></i>
          <span *ngIf="!isCollapsed">Goals</span>
        </a>

        <a
          routerLink="/expense-sharing"
          routerLinkActive="active"
          class="nav-item"
          [title]="isCollapsed ? 'Expense Sharing' : ''"
        >
          <i class="fas fa-users"></i>
          <span *ngIf="!isCollapsed">Sharing</span>
        </a>

        <div class="nav-divider" *ngIf="!isCollapsed"></div>

        <a
          href="#"
          (click)="$event.preventDefault(); toggleDarkMode()"
          class="nav-item"
          [title]="isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''"
        >
          <i class="fas" [class.fa-sun]="isDarkMode" [class.fa-moon]="!isDarkMode"></i>
          <span *ngIf="!isCollapsed">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </a>

        <a
          href="#"
          (click)="logout($event)"
          class="nav-item logout"
          [title]="isCollapsed ? 'Logout' : ''"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span *ngIf="!isCollapsed">Logout</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <small>© 2024 MoneyTrack</small>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: var(--sidebar-width);
        background: var(--glass-bg-heavy);
        backdrop-filter: var(--glass-blur-heavy);
        -webkit-backdrop-filter: var(--glass-blur-heavy);
        color: white;
        display: flex;
        flex-direction: column;
        transition: width var(--transition-base);
        z-index: 1000;
        box-shadow: var(--shadow-xl);
        border-right: 1px solid var(--glass-border);
      }

      /* Gradient overlay */
      .sidebar::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--sidebar-bg);
        z-index: -1;
        opacity: 0.9;
      }

      .sidebar.collapsed {
        width: var(--sidebar-collapsed-width);
      }

      /* Header */
      .sidebar-header {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .logo i {
        font-size: 1.75rem;
      }

      .logo-text {
        white-space: nowrap;
        overflow: hidden;
      }

      .toggle-btn {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);
      }

      .toggle-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      }

      /* User Info */
      .user-info {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
        transition: all var(--transition-fast);
      }

      .user-avatar:hover {
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
      }

      .user-details {
        flex: 1;
        min-width: 0;
      }

      .user-name {
        font-weight: 600;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-email {
        font-size: 0.75rem;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Navigation */
      .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
        overflow-y: auto;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.875rem 1.5rem;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        transition: all var(--transition-fast);
        position: relative;
        font-weight: 500;
        border-left: 3px solid transparent;
      }

      .nav-item i {
        font-size: 1.25rem;
        width: 24px;
        text-align: center;
      }

      .nav-item span {
        white-space: nowrap;
      }

      .nav-item:hover {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: white;
        border-left-color: rgba(255, 255, 255, 0.5);
      }

      .nav-item.active {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: white;
        border-left-color: white;
      }

      .nav-item.active::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background: white;
        border-radius: 4px 0 0 4px;
      }

      .nav-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.15);
        margin: 1rem 1.5rem;
      }

      .nav-item.logout {
        color: rgba(255, 255, 255, 0.8);
      }

      .nav-item.logout:hover {
        background: rgba(245, 101, 101, 0.25);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: white;
        border-left-color: var(--danger-color);
      }

      /* Footer */
      .sidebar-footer {
        padding: 1rem 1.5rem;
        text-align: center;
        opacity: 0.6;
        font-size: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      /* Collapsed State */
      .sidebar.collapsed .sidebar-header,
      .sidebar.collapsed .user-info,
      .sidebar.collapsed .nav-item {
        justify-content: center;
      }

      .sidebar.collapsed .toggle-btn {
        margin: 0 auto;
      }

      /* Mobile */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%);
        }

        .sidebar.show {
          transform: translateX(0);
        }
      }

      /* Scrollbar */
      .sidebar-nav::-webkit-scrollbar {
        width: 4px;
      }

      .sidebar-nav::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      .sidebar-nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      .sidebar-nav::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  @Output() sidebarCollapsed = new EventEmitter<boolean>();
  currentUser: User | null = null;
  isCollapsed = false;

  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.darkModeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarCollapsed.emit(this.isCollapsed);
  }

  toggleDarkMode(): void {
    this.darkModeService.toggleDarkMode();
  }

  logout(event: Event): void {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
