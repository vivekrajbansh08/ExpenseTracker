import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseShareService } from '../../core/services/expense-share.service';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';

interface Participant {
  email: string;        // Required - primary identifier
  name?: string;        // Optional - display name
  amount?: number;
  percentage?: number;
  isCurrentUser?: boolean;
}

@Component({
  selector: 'app-expense-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><i class="fas fa-users me-2"></i>Expense Sharing</h2>
          <p class="text-muted">Split bills with friends easily</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus me-2"></i>New Expense
        </button>
      </div>

      <!-- Expense List -->
      <div class="row">
        <div class="col-md-6 mb-4" *ngFor="let expense of expenses">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ expense.description }}</h5>
                <div class="d-flex gap-2 align-items-center">
                  <span class="badge" [class.bg-success]="expense.isSettled" [class.bg-warning]="!expense.isSettled">
                    {{ expense.isSettled ? 'Settled' : 'Unsettled' }}
                  </span>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteExpense(expense._id)" title="Delete expense">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <h3 class="card-text mb-3">₹{{ expense.totalAmount | number:'1.2-2' }}</h3>
              <p class="text-muted small mb-2">
                Paid by <span class="fw-bold">{{ expense.paidBy?.name || 'Unknown' }}</span>
              </p>
              
              <div class="mb-3">
                <small class="text-muted d-block mb-2">Splits:</small>
                <div class="list-group list-group-flush">
                  <div class="list-group-item d-flex justify-content-between align-items-center px-0" *ngFor="let split of expense.splits">
                    <div>
                      <i class="fas fa-user me-2"></i>
                      <strong>{{ split.user?.name || split.userId?.email || 'User' }}</strong>
                      <span class="ms-2">₹{{ split.amount | number:'1.0-0' }}</span>
                    </div>
                    <div>
                      <span class="badge bg-success me-2" *ngIf="split.paid">
                        <i class="fas fa-check"></i> Paid
                      </span>
                      <button 
                        class="btn btn-sm btn-outline-success" 
                        *ngIf="!split.paid"
                        (click)="settleSplit(expense._id, split.userId?._id || split.userId, split._id)">
                        <i class="fas fa-check"></i> Settle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-muted small">
                <i class="fas fa-clock me-1"></i> {{ expense.createdAt | date }}
              </div>
            </div>
            <div class="card-footer bg-transparent border-top-0 d-flex justify-content-end gap-2" *ngIf="!expense.isSettled">
              <button class="btn btn-sm btn-outline-primary" (click)="settleAllSplits(expense._id)">
                <i class="fas fa-check-double"></i> Settle All
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="expenses.length === 0 && !loading" class="text-center py-5">
        <div class="empty-state">
          <i class="fas fa-users fa-4x text-muted mb-3"></i>
          <h4>No Shared Expenses</h4>
          <p class="text-muted">Add an expense to split costs with friends.</p>
          <button class="btn btn-primary mt-2" (click)="openCreateModal()">
            Start Sharing
          </button>
        </div>
      </div>

      <!-- Create Modal -->
      <div class="modal-backdrop fade show" *ngIf="showCreateModal"></div>
      <div class="modal fade show d-block" *ngIf="showCreateModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Shared Expense</h5>
              <button type="button" class="btn-close" (click)="showCreateModal = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Description</label>
                    <input type="text" class="form-control" [(ngModel)]="currentExpense.description" name="description" required placeholder="e.g. Dinner, Trip" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Total Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">₹</span>
                      <input type="number" class="form-control" [(ngModel)]="currentExpense.totalAmount" name="totalAmount" required (input)="recalculateSplits()" />
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Paid By</label>
                  <select class="form-select" [(ngModel)]="paidBy" name="paidBy">
                    <option value="me">You</option>
                    <option value="friend">Friend</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Split Method</label>
                  <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" name="splitMethod" id="equal" value="equal" [(ngModel)]="splitMethod" (change)="recalculateSplits()">
                    <label class="btn btn-outline-primary" for="equal">Equal (=)</label>

                    <input type="radio" class="btn-check" name="splitMethod" id="exact" value="exact" [(ngModel)]="splitMethod" (change)="recalculateSplits()">
                    <label class="btn btn-outline-primary" for="exact">Exact Amount (₹)</label>

                    <input type="radio" class="btn-check" name="splitMethod" id="percentage" value="percentage" [(ngModel)]="splitMethod" (change)="recalculateSplits()">
                    <label class="btn btn-outline-primary" for="percentage">Percentage (%)</label>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label d-flex justify-content-between">
                    <span>Participants</span>
                    <button type="button" class="btn btn-sm btn-link" (click)="addParticipant()">
                      <i class="fas fa-plus"></i> Add Person
                    </button>
                  </label>
                  
                  <div class="participant-list">
                    <div class="row g-2 mb-2 align-items-center" *ngFor="let p of participants; let i = index">
                      <div class="col-md-4">
                        <input
                          type="email"
                          class="form-control form-control-sm"
                          [(ngModel)]="p.email"
                          [name]="'email'+i"
                          [placeholder]="p.isCurrentUser ? 'Your email' : 'Participant email'"
                          [disabled]="p.isCurrentUser || false"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <div class="input-group" *ngIf="splitMethod === 'exact'">
                          <span class="input-group-text">₹</span>
                          <input type="number" class="form-control" [(ngModel)]="p.amount" [name]="'amount'+i" (input)="validateTotal()" />
                        </div>
                        <div class="input-group" *ngIf="splitMethod === 'percentage'">
                          <input type="number" class="form-control" [(ngModel)]="p.percentage" [name]="'percent'+i" (input)="recalculateSplits()" />
                          <span class="input-group-text">%</span>
                        </div>
                        <div class="form-control bg-light" *ngIf="splitMethod === 'equal'">
                          ₹{{ p.amount | number:'1.2-2' }}
                        </div>
                      </div>
                      <div class="col-md-1" *ngIf="!p.isCurrentUser">
                        <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeParticipant(i)">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="alert alert-danger mt-2" *ngIf="validationError">
                    {{ validationError }}
                  </div>
                </div>

                <div class="d-grid mt-4">
                  <button type="submit" class="btn btn-primary" [disabled]="!!validationError">
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { transition: transform 0.2s; }
    .card:hover { transform: translateY(-5px); }
    .empty-state { padding: 3rem; background: var(--surface-bg); border-radius: 1rem; border: 1px dashed var(--border-color); }
  `]
})
export class ExpenseShareComponent implements OnInit {
  expenses: any[] = [];
  loading = false;
  showCreateModal = false;
  currentUser: any = null;

  currentExpense: any = {
    description: '',
    totalAmount: 0,
  };

  paidBy = 'me';
  splitMethod = 'equal';
  participants: Participant[] = [];
  validationError = '';

  constructor(
    private shareService: ExpenseShareService,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.resetForm();
    });
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading = true;
    this.shareService.getExpenseShares().subscribe({
      next: (res) => {
        this.expenses = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

  resetForm(): void {
    this.currentExpense = { description: '', totalAmount: 0 };
    this.paidBy = 'me';
    this.splitMethod = 'equal';
    this.participants = [
      { email: this.currentUser?.email || '', isCurrentUser: true, amount: 0, percentage: 50 },
      { email: '', amount: 0, percentage: 50 }
    ];
    this.validationError = '';
  }

  addParticipant(): void {
    this.participants.push({ email: '', amount: 0, percentage: 0 });
    this.recalculateSplits();
  }

  removeParticipant(index: number): void {
    this.participants.splice(index, 1);
    this.recalculateSplits();
  }

  recalculateSplits(): void {
    const total = this.currentExpense.totalAmount || 0;
    const count = this.participants.length;

    if (this.splitMethod === 'equal') {
      const share = total / count;
      this.participants.forEach(p => p.amount = share);
      this.validationError = '';
    } else if (this.splitMethod === 'percentage') {
      let totalPercent = 0;
      this.participants.forEach(p => {
        p.amount = (total * (p.percentage || 0)) / 100;
        totalPercent += p.percentage || 0;
      });
      if (Math.abs(totalPercent - 100) > 0.1) {
        this.validationError = `Total percentage must be 100% (Current: ${totalPercent}%)`;
      } else {
        this.validationError = '';
      }
    } else {
      this.validateTotal();
    }
  }

  validateTotal(): void {
    if (this.splitMethod === 'exact') {
      const sum = this.participants.reduce((acc, p) => acc + (p.amount || 0), 0);
      if (Math.abs(sum - this.currentExpense.totalAmount) > 0.1) {
        this.validationError = `Total split amount (₹${sum}) must match expense amount (₹${this.currentExpense.totalAmount})`;
      } else {
        this.validationError = '';
      }
    }
  }

  onSubmit(): void {
    if (this.validationError) return;

    // Step 1: Create a transaction first
    const transactionData = {
      description: this.currentExpense.description,
      amount: this.currentExpense.totalAmount,
      category: 'Shared Expense',
      type: 'expense' as 'income' | 'expense',
      date: new Date()
    };

    // Create transaction first, then use its ID for the expense share
    this.transactionService.createTransaction(transactionData).subscribe({
      next: (transactionResponse) => {
        // Step 2: Now create the expense share with the transaction ID
        const splits = this.participants.map(p => ({
          email: p.email,
          amount: p.amount || 0,
          paid: !!(p.isCurrentUser && this.paidBy === 'me')
        }));

        const expenseData = {
          transactionId: transactionResponse.data._id, // Use the created transaction's ID
          description: this.currentExpense.description,
          totalAmount: this.currentExpense.totalAmount,
          paidBy: this.currentUser.id,
          splits: splits
        };

        this.shareService.createExpenseShare(expenseData).subscribe({
          next: () => {
            this.loadExpenses();
            this.showCreateModal = false;
          },
          error: (err) => {
            console.error('Error creating expense share:', err);
            alert('Failed to create expense share: ' + (err.error?.message || err.message));
          }
        });
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        alert('Failed to create transaction: ' + (err.error?.message || err.message));
      }
    });
  }

  settleSplit(expenseId: string, userId: string, splitId?: string): void {
    console.log('Settling split for expense:', expenseId, 'user:', userId, 'splitId:', splitId);
    this.shareService.settleSplit(expenseId, userId, splitId).subscribe({
      next: (response) => {
        console.log('Settlement response:', response);
        this.loadExpenses();
      },
      error: (err) => {
        console.error('Error settling split:', err);
        alert('Failed to settle: ' + (err.error?.message || err.message));
      }
    });
  }

  settleAllSplits(expenseId: string): void {
    const expense = this.expenses.find(e => e._id === expenseId);
    if (!expense) {
      console.error('Expense not found:', expenseId);
      return;
    }

    const unpaidSplits = expense.splits.filter((s: any) => !s.paid);
    if (unpaidSplits.length === 0) {
      alert('All splits are already settled!');
      return;
    }

    console.log('Settling all splits for expense:', expenseId, 'count:', unpaidSplits.length);
    
    // Settle each unpaid split sequentially
    let settledCount = 0;
    const settleNext = (index: number) => {
      if (index >= unpaidSplits.length) {
        // All done
        console.log('All splits settled successfully');
        this.loadExpenses();
        return;
      }

      const split = unpaidSplits[index];
      const userId = split.userId._id || split.userId;
      const splitId = split._id;
      
      this.shareService.settleSplit(expenseId, userId, splitId).subscribe({
        next: () => {
          settledCount++;
          console.log(`Settled split ${settledCount}/${unpaidSplits.length}`);
          settleNext(index + 1); // Settle next split
        },
        error: (err) => {
          console.error('Error settling split:', err);
          alert(`Failed to settle split ${index + 1}: ` + (err.error?.message || err.message));
        }
      });
    };

    settleNext(0);
  }

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      this.shareService.deleteExpenseShare(id).subscribe({
        next: () => {
          this.loadExpenses();
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
          alert('Failed to delete expense: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}
