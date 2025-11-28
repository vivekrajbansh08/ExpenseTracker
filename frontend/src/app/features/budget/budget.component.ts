import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { Budget, BudgetProgress } from '../../shared/models/budget.model';
import { EXPENSE_CATEGORIES } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row mb-4">
        <div class="col-md-6">
          <h2><i class="fas fa-piggy-bank me-2"></i>Budget Management</h2>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-primary" (click)="showAddModal()">
            <i class="fas fa-plus me-2"></i>Set Budget
          </button>
        </div>
      </div>

      <!-- Month/Year Selector -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="input-group">
            <label class="input-group-text">Month</label>
            <select class="form-select" [(ngModel)]="selectedMonth" (change)="loadData()">
              <option *ngFor="let month of months; let i = index" [value]="i + 1">
                {{ month }}
              </option>
            </select>
            <label class="input-group-text">Year</label>
            <select class="form-select" [(ngModel)]="selectedYear" (change)="loadData()">
              <option *ngFor="let year of years" [value]="year">{{ year }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Budget Progress Cards -->
      <div class="row" *ngIf="budgetProgress.length > 0">
        <div class="col-md-6 mb-4" *ngFor="let progress of budgetProgress">
          <div class="card budget-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">{{ progress.budget.category }}</h5>
                <div>
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    (click)="editBudget(progress.budget)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="deleteBudget(progress.budget._id!)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="budget-amount mb-3">
                <div class="d-flex justify-content-between">
                  <span>Spent: ₹{{ progress.spent | number : '1.2-2' }}</span>
                  <span>Budget: ₹{{ progress.budget.amount | number : '1.2-2' }}</span>
                </div>
              </div>

              <div class="progress mb-2" style="height: 25px;">
                <div
                  class="progress-bar"
                  [class.bg-success]="progress.percentage <= 75"
                  [class.bg-warning]="progress.percentage > 75 && progress.percentage <= 100"
                  [class.bg-danger]="progress.percentage > 100"
                  [style.width.%]="progress.percentage > 100 ? 100 : progress.percentage"
                >
                  {{ progress.percentage }}%
                </div>
              </div>

              <div class="text-end">
                <small
                  [class.text-success]="progress.remaining > 0"
                  [class.text-danger]="progress.remaining < 0"
                >
                  {{ progress.remaining >= 0 ? 'Remaining' : 'Exceeded' }}: ₹{{
                    Math.abs(progress.remaining) | number : '1.2-2'
                  }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="budgetProgress.length === 0" class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        No budgets set for this month. Click "Set Budget" to create one.
      </div>

      <!-- Add/Edit Modal -->
      <div
        class="modal fade"
        [class.show]="showModal"
        [style.display]="showModal ? 'block' : 'none'"
        tabindex="-1"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ editMode ? 'Edit Budget' : 'Set Budget' }}
              </h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #budgetForm="ngForm">
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <select
                    class="form-select"
                    [(ngModel)]="currentBudget.category"
                    name="category"
                    required
                    [disabled]="editMode"
                  >
                    <option *ngFor="let cat of expenseCategories" [value]="cat">{{ cat }}</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Budget Amount</label>
                  <input
                    type="number"
                    class="form-control"
                    [(ngModel)]="currentBudget.amount"
                    name="amount"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Month</label>
                  <select
                    class="form-select"
                    [(ngModel)]="currentBudget.month"
                    name="month"
                    required
                    [disabled]="editMode"
                  >
                    <option *ngFor="let month of months; let i = index" [value]="i + 1">
                      {{ month }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Year</label>
                  <select
                    class="form-select"
                    [(ngModel)]="currentBudget.year"
                    name="year"
                    required
                    [disabled]="editMode"
                  >
                    <option *ngFor="let year of years" [value]="year">{{ year }}</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button
                type="button"
                class="btn btn-primary"
                [disabled]="!budgetForm.valid || loading"
                (click)="saveBudget()"
              >
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editMode ? 'Update' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade" [class.show]="showModal" *ngIf="showModal"></div>
    </div>
  `,
  styles: [
    `
      .budget-card {
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        transition: transform 0.2s;
      }
      .budget-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .modal.show {
        display: block;
      }
      .modal-backdrop.show {
        display: block;
        opacity: 0.5;
      }
    `,
  ],
})
export class BudgetComponent implements OnInit {
  budgetProgress: BudgetProgress[] = [];
  showModal = false;
  editMode = false;
  loading = false;
  Math = Math;

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  currentBudget: Budget = this.getEmptyBudget();

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  expenseCategories = EXPENSE_CATEGORIES;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.budgetService.getBudgetProgress(this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        this.budgetProgress = response.data;
      },
      error: (error) => console.error('Error loading budgets:', error),
    });
  }

  showAddModal(): void {
    this.editMode = false;
    this.currentBudget = this.getEmptyBudget();
    this.showModal = true;
  }

  editBudget(budget: Budget): void {
    this.editMode = true;
    this.currentBudget = { ...budget };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBudget = this.getEmptyBudget();
  }

  saveBudget(): void {
    this.loading = true;

    if (this.editMode && this.currentBudget._id) {
      this.budgetService.updateBudget(this.currentBudget._id, this.currentBudget).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating budget:', error);
          alert(error.error.message || 'Error updating budget');
          this.loading = false;
        },
      });
    } else {
      this.budgetService.createBudget(this.currentBudget).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating budget:', error);
          alert(error.error.message || 'Error creating budget');
          this.loading = false;
        },
      });
    }
  }

  deleteBudget(id: string): void {
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => console.error('Error deleting budget:', error),
      });
    }
  }

  getEmptyBudget(): Budget {
    return {
      category: 'Food',
      amount: 0,
      month: this.selectedMonth,
      year: this.selectedYear,
    };
  }
}
