import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SavingsGoalService, SavingsGoal } from '../../core/services/savings-goal.service';

@Component({
  selector: 'app-savings-goal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-bullseye me-2"></i>Savings Goals</h2>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <i class="fas fa-plus me-2"></i>Add Goal
        </button>
      </div>

      <!-- Goals List -->
      <div class="row">
        <div class="col-md-6 mb-4" *ngFor="let goal of goals">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ goal.name }}</h5>
                <span class="badge" [class.bg-success]="goal.isCompleted" [class.bg-primary]="!goal.isCompleted">
                  {{ goal.isCompleted ? 'Completed' : 'In Progress' }}
                </span>
              </div>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="text-muted small">Progress</span>
                  <span class="fw-bold small">{{ (goal.currentAmount / goal.targetAmount) * 100 | number:'1.0-0' }}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div class="progress-bar bg-success" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"></div>
                </div>
              </div>

              <div class="d-flex justify-content-between text-muted mb-3">
                <div>
                  <small class="d-block">Current</small>
                  <span class="fw-bold">₹{{ goal.currentAmount | number:'1.0-0' }}</span>
                </div>
                <div class="text-end">
                  <small class="d-block">Target</small>
                  <span class="fw-bold">₹{{ goal.targetAmount | number:'1.0-0' }}</span>
                </div>
              </div>

              <div class="text-muted small mb-3">
                <i class="fas fa-calendar me-1"></i> Target Date: {{ goal.targetDate | date }}
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-sm btn-outline-primary" (click)="openContributeModal(goal)">
                  <i class="fas fa-plus-circle me-1"></i>Add Contribution
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="goals.length === 0 && !loading" class="text-center py-5">
        <i class="fas fa-bullseye fa-3x text-muted mb-3"></i>
        <p class="text-muted">No savings goals yet. Set a goal and start saving!</p>
      </div>

      <!-- Create Modal -->
      <div class="modal-backdrop fade show" *ngIf="showCreateModal"></div>
      <div class="modal fade show d-block" *ngIf="showCreateModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Set Savings Goal</h5>
              <button type="button" class="btn-close" (click)="showCreateModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Goal Name</label>
                  <input type="text" class="form-control" [(ngModel)]="currentGoal.name" name="name" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Target Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="currentGoal.targetAmount" name="targetAmount" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Target Date</label>
                  <input type="date" class="form-control" [(ngModel)]="currentGoal.targetDate" name="targetDate" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-control" [(ngModel)]="currentGoal.category" name="category" />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Create Goal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Contribute Modal -->
      <div class="modal-backdrop fade show" *ngIf="showContributeModal"></div>
      <div class="modal fade show d-block" *ngIf="showContributeModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Contribution</h5>
              <button type="button" class="btn-close" (click)="showContributeModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="onContribute()">
                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <input type="number" class="form-control" [(ngModel)]="contributionAmount" name="amount" required />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-success">Add Funds</button>
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
  `]
})
export class SavingsGoalComponent implements OnInit {
  goals: SavingsGoal[] = [];
  loading = false;
  showCreateModal = false;
  showContributeModal = false;
  selectedGoalId = '';
  contributionAmount = 0;

  currentGoal: Partial<SavingsGoal> = {
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: new Date(),
    category: 'General'
  };

  constructor(private goalService: SavingsGoalService) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading = true;
    this.goalService.getSavingsGoals().subscribe({
      next: (res) => {
        this.goals = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    const goalData = {
      ...this.currentGoal,
      targetDate: new Date(this.currentGoal.targetDate as any)
    };

    this.goalService.createSavingsGoal(goalData).subscribe({
      next: () => {
        this.loadGoals();
        this.showCreateModal = false;
        this.currentGoal = { name: '', targetAmount: 0, currentAmount: 0, targetDate: new Date().toISOString().split('T')[0] as any, category: 'General' };
      },
      error: (err) => console.error(err)
    });
  }

  openContributeModal(goal: SavingsGoal): void {
    this.selectedGoalId = goal._id;
    this.showContributeModal = true;
  }

  onContribute(): void {
    if (this.contributionAmount > 0) {
      this.goalService.addProgress(this.selectedGoalId, this.contributionAmount).subscribe({
        next: () => {
          this.loadGoals();
          this.showContributeModal = false;
          this.contributionAmount = 0;
        },
        error: (err) => console.error(err)
      });
    }
  }
}
