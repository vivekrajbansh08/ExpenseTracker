import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="app-wrapper">
      <!-- Sidebar (only show when authenticated) -->
      <app-sidebar 
        *ngIf="isAuthenticated"
        (sidebarCollapsed)="onSidebarCollapse($event)"
      ></app-sidebar>

      <!-- Main Content -->
      <main
        class="main-content"
        [class.with-sidebar]="isAuthenticated && !sidebarCollapsed"
        [class.with-sidebar-collapsed]="isAuthenticated && sidebarCollapsed"
        [class.auth-page]="!isAuthenticated"
      >
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-wrapper {
        min-height: 100vh;
        background: var(--bg-color);
      }

      .main-content {
        min-height: 100vh;
        transition: margin-left var(--transition-base);
      }

      .main-content.with-sidebar {
        margin-left: var(--sidebar-width);
        padding: 2rem;
      }

      .main-content.with-sidebar-collapsed {
        margin-left: var(--sidebar-collapsed-width);
        padding: 2rem;
      }

      .main-content.auth-page {
        margin-left: 0;
        padding: 0;
      }

      @media (max-width: 768px) {
        .main-content.with-sidebar,
        .main-content.with-sidebar-collapsed {
          margin-left: 0;
          padding: 1rem;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'MoneyTrack';
  isAuthenticated = false;
  sidebarCollapsed = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    // Also check on route changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
}
