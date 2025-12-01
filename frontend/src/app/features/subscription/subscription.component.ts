import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionService, Subscription } from '../../core/services/subscription.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-calendar-check me-2"></i>Subscriptions</h2>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <i class="fas fa-plus me-2"></i>Add Subscription
        </button>
      </div>

      <!-- Subscription List -->
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let sub of subscriptions">
          <div class="card h-100" [style.border-left]="'5px solid ' + sub.color">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ sub.name }}</h5>
                <span class="badge" [class.bg-success]="sub.isActive" [class.bg-secondary]="!sub.isActive">
                  {{ sub.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <h3 class="card-text mb-2">
                ₹ {{ sub.amount | number : '1.2-2' }}
              </h3>
              <p class="text-muted mb-3">{{ sub.billingCycle | titlecase }}</p>
              
              <div class="d-flex justify-content-between text-muted small">
                <span><i class="fas fa-tag me-1"></i>{{ sub.category }}</span>
                <span><i class="fas fa-clock me-1"></i>Next: {{ sub.nextBillingDate | date }}</span>
              </div>
            </div>
            <div class="card-footer bg-transparent border-top-0 text-end">
              <button class="btn btn-sm btn-outline-danger" (click)="deleteSubscription(sub._id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="subscriptions.length === 0 && !loading" class="text-center py-5">
        <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
        <p class="text-muted">No subscriptions found. Track your recurring expenses!</p>
      </div>

      <!-- Create Modal -->
      <div class="modal-backdrop fade show" *ngIf="showCreateModal"></div>
      <div class="modal fade show d-block" *ngIf="showCreateModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Subscription</h5>
              <button type="button" class="btn-close" (click)="showCreateModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" [(ngModel)]="currentSub.name" name="name" required />
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Amount</label>
                    <input type="number" class="form-control" [(ngModel)]="currentSub.amount" name="amount" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Currency</label>
                    <select class="form-select" [(ngModel)]="currentSub.currency" name="currency" required>
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Frequency</label>
                  <select class="form-select" [(ngModel)]="currentSub.frequency" name="frequency" required>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-control" [(ngModel)]="currentSub.category" name="category" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" [(ngModel)]="currentSub.startDate" name="startDate" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <input type="color" class="form-control form-control-color" [(ngModel)]="currentSub.color" name="color" />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Add Subscription</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .card:hover { transform: translateY(-5px); }
    .form-control-color { width: 100%; }
  `]
})
export class SubscriptionComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loading = false;
  showCreateModal = false;

  currentSub: any = {
    name: '',
    amount: 0,
    currency: 'INR',
    frequency: 'monthly',
    category: 'Entertainment',
    startDate: new Date().toISOString().split('T')[0],
    color: '#e53e3e',
    isActive: true
  };

  constructor(private subService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.subService.getSubscriptions().subscribe({
      next: (res) => {
        this.subscriptions = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    const subData = {
      ...this.currentSub,
      billingCycle: this.currentSub.frequency,
      startDate: new Date(this.currentSub.startDate),
      reminderDays: 3
    };
    
    delete subData.frequency;
    delete subData.currency;

    this.subService.createSubscription(subData).subscribe({
      next: () => {
        this.loadSubscriptions();
        this.showCreateModal = false;
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }

  deleteSubscription(id: string): void {
    if(confirm('Delete this subscription?')) {
      this.subService.cancelSubscription(id).subscribe({
        next: () => this.loadSubscriptions()
      });
    }
  }

  resetForm(): void {
    this.currentSub = {
      name: '',
      amount: 0,
      currency: 'INR',
      frequency: 'monthly',
      category: 'Entertainment',
      startDate: new Date().toISOString().split('T')[0],
      color: '#e53e3e',
      isActive: true
    };
  }
}
