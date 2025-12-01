// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TransactionService } from '../../../core/services/transaction.service';
// import {
//   Transaction,
//   EXPENSE_CATEGORIES,
//   INCOME_CATEGORIES,
// } from '../../../shared/models/transaction.model';

// @Component({
//   selector: 'app-transaction-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="container mt-4">
//       <div class="row mb-4">
//         <div class="col-md-6">
//           <h2><i class="fas fa-list me-2"></i>Transactions</h2>
//         </div>
//         <div class="col-md-6 text-end">
//           <button class="btn btn-primary" (click)="showAddModal()">
//             <i class="fas fa-plus me-2"></i>Add Transaction
//           </button>
//         </div>
//       </div>

//       <!-- Filters -->
//       <div class="card mb-4">
//         <div class="card-body">
//           <div class="row">
//             <div class="col-md-3">
//               <label class="form-label">Type</label>
//               <select class="form-select" [(ngModel)]="filters.type" (change)="applyFilters()">
//                 <option value="">All</option>
//                 <option value="income">Income</option>
//                 <option value="expense">Expense</option>
//               </select>
//             </div>
//             <div class="col-md-3">
//               <label class="form-label">Category</label>
//               <select class="form-select" [(ngModel)]="filters.category" (change)="applyFilters()">
//                 <option value="">All</option>
//                 <option *ngFor="let cat of allCategories" [value]="cat">{{ cat }}</option>
//               </select>
//             </div>
//             <div class="col-md-3">
//               <label class="form-label">Start Date</label>
//               <input
//                 type="date"
//                 class="form-control"
//                 [(ngModel)]="filters.startDate"
//                 (change)="applyFilters()"
//               />
//             </div>
//             <div class="col-md-3">
//               <label class="form-label">End Date</label>
//               <input
//                 type="date"
//                 class="form-control"
//                 [(ngModel)]="filters.endDate"
//                 (change)="applyFilters()"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Transactions Table -->
//       <div class="card">
//         <div class="card-body">
//           <div class="table-responsive">
//             <table class="table table-hover">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Type</th>
//                   <th>Category</th>
//                   <th>Description</th>
//                   <th class="text-end">Amount</th>
//                   <th class="text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr *ngFor="let transaction of transactions">
//                   <td>{{ transaction.date | date : 'MMM dd, yyyy' }}</td>
//                   <td>
//                     <span
//                       class="badge"
//                       [class.bg-success]="transaction.type === 'income'"
//                       [class.bg-danger]="transaction.type === 'expense'"
//                     >
//                       {{ transaction.type }}
//                     </span>
//                   </td>
//                   <td>{{ transaction.category }}</td>
//                   <td>{{ transaction.description || '-' }}</td>
//                   <td
//                     class="text-end fw-bold"
//                     [class.text-success]="transaction.type === 'income'"
//                     [class.text-danger]="transaction.type === 'expense'"
//                   >
//                     {{ transaction.type === 'expense' ? '-' : '+' }}₹{{
//                       transaction.amount | number : '1.2-2'
//                     }}
//                   </td>
//                   <td class="text-end">
//                     <button
//                       class="btn btn-sm btn-outline-primary me-2"
//                       (click)="editTransaction(transaction)"
//                     >
//                       <i class="fas fa-edit"></i>
//                     </button>
//                     <button
//                       class="btn btn-sm btn-outline-danger"
//                       (click)="deleteTransaction(transaction._id!)"
//                     >
//                       <i class="fas fa-trash"></i>
//                     </button>
//                   </td>
//                 </tr>
//                 <tr *ngIf="transactions.length === 0">
//                   <td colspan="6" class="text-center text-muted py-4">No transactions found</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <!-- Add/Edit Modal -->
//       <div
//         class="modal fade"
//         [class.show]="showModal"
//         [style.display]="showModal ? 'block' : 'none'"
//         tabindex="-1"
//       >
//         <div class="modal-dialog">
//           <div class="modal-content">
//             <div class="modal-header">
//               <h5 class="modal-title">
//                 {{ editMode ? 'Edit Transaction' : 'Add Transaction' }}
//               </h5>
//               <button type="button" class="btn-close" (click)="closeModal()"></button>
//             </div>
//             <div class="modal-body">
//               <form #transactionForm="ngForm">
//                 <div class="mb-3">
//                   <label class="form-label">Type</label>
//                   <select
//                     class="form-select"
//                     [(ngModel)]="currentTransaction.type"
//                     name="type"
//                     required
//                     (change)="onTypeChange()"
//                   >
//                     <option value="income">Income</option>
//                     <option value="expense">Expense</option>
//                   </select>
//                 </div>

//                 <div class="mb-3">
//                   <label class="form-label">Category</label>
//                   <select
//                     class="form-select"
//                     [(ngModel)]="currentTransaction.category"
//                     name="category"
//                     required
//                   >
//                     <option *ngFor="let cat of availableCategories" [value]="cat">{{ cat }}</option>
//                   </select>
//                 </div>

//                 <div class="mb-3">
//                   <label class="form-label">Amount</label>
//                   <input
//                     type="number"
//                     class="form-control"
//                     [(ngModel)]="currentTransaction.amount"
//                     name="amount"
//                     required
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>

//                 <div class="mb-3">
//                   <label class="form-label">Date</label>
//                   <input
//                     type="date"
//                     class="form-control"
//                     [(ngModel)]="currentTransaction.date"
//                     name="date"
//                     required
//                   />
//                 </div>

//                 <div class="mb-3">
//                   <label class="form-label">Description</label>
//                   <textarea
//                     class="form-control"
//                     [(ngModel)]="currentTransaction.description"
//                     name="description"
//                     rows="3"
//                   ></textarea>
//                 </div>
//               </form>
//             </div>
//             <div class="modal-footer">
//               <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
//               <button
//                 type="button"
//                 class="btn btn-primary"
//                 [disabled]="!transactionForm.valid || loading"
//                 (click)="saveTransaction()"
//               >
//                 <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
//                 {{ editMode ? 'Update' : 'Save' }}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div class="modal-backdrop fade" [class.show]="showModal" *ngIf="showModal"></div>
//     </div>
//   `,
//   styles: [
//     `
//       .modal.show {
//         display: block;
//       }
//       .modal-backdrop.show {
//         display: block;
//         opacity: 0.5;
//       }
//     `,
//   ],
// })
// export class TransactionListComponent implements OnInit {
//   transactions: Transaction[] = [];
//   showModal = false;
//   editMode = false;
//   loading = false;

//   currentTransaction: Transaction = this.getEmptyTransaction();

//   filters = {
//     type: '',
//     category: '',
//     startDate: '',
//     endDate: '',
//   };

//   allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
//   availableCategories: string[] = EXPENSE_CATEGORIES;

//   constructor(private transactionService: TransactionService) {}

//   ngOnInit(): void {
//     this.loadTransactions();
//   }

//   loadTransactions(): void {
//     this.transactionService.getTransactions(this.filters).subscribe({
//       next: (response) => {
//         this.transactions = response.data;
//       },
//       error: (error) => console.error('Error loading transactions:', error),
//     });
//   }

//   applyFilters(): void {
//     this.loadTransactions();
//   }

//   showAddModal(): void {
//     this.editMode = false;
//     this.currentTransaction = this.getEmptyTransaction();
//     this.availableCategories = EXPENSE_CATEGORIES;
//     this.showModal = true;
//   }

//   editTransaction(transaction: Transaction): void {
//     this.editMode = true;
//     this.currentTransaction = { ...transaction };
//     this.onTypeChange();
//     this.showModal = true;
//   }

//   closeModal(): void {
//     this.showModal = false;
//     this.currentTransaction = this.getEmptyTransaction();
//   }

//   onTypeChange(): void {
//     this.availableCategories =
//       this.currentTransaction.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
//     this.currentTransaction.category = this.availableCategories[0];
//   }

//   saveTransaction(): void {
//     this.loading = true;

//     if (this.editMode && this.currentTransaction._id) {
//       this.transactionService
//         .updateTransaction(this.currentTransaction._id, this.currentTransaction)
//         .subscribe({
//           next: () => {
//             this.loadTransactions();
//             this.closeModal();
//             this.loading = false;
//           },
//           error: (error) => {
//             console.error('Error updating transaction:', error);
//             this.loading = false;
//           },
//         });
//     } else {
//       this.transactionService.createTransaction(this.currentTransaction).subscribe({
//         next: () => {
//           this.loadTransactions();
//           this.closeModal();
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error creating transaction:', error);
//           this.loading = false;
//         },
//       });
//     }
//   }

//   deleteTransaction(id: string): void {
//     if (confirm('Are you sure you want to delete this transaction?')) {
//       this.transactionService.deleteTransaction(id).subscribe({
//         next: () => {
//           this.loadTransactions();
//         },
//         error: (error) => console.error('Error deleting transaction:', error),
//       });
//     }
//   }

//   getEmptyTransaction(): Transaction {
//     return {
//       type: 'expense',
//       amount: 0,
//       category: 'Food',
//       description: '',
//       date: new Date().toISOString().split('T')[0],
//     };
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import {
  Transaction,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1><i class="fas fa-exchange-alt me-2"></i>Transactions</h1>
          <p class="text-muted">Manage your income and expenses</p>
        </div>
        <button class="btn btn-primary" (click)="showAddModal()">
          <i class="fas fa-plus me-2"></i>Add Transaction
        </button>
      </div>

      <!-- View Toggle & Quick Stats -->
      <div class="controls-bar">
        <div class="view-toggle">
          <button
            class="toggle-btn"
            [class.active]="viewMode === 'list'"
            (click)="viewMode = 'list'"
          >
            <i class="fas fa-list"></i>
            <span>List</span>
          </button>
          <button
            class="toggle-btn"
            [class.active]="viewMode === 'calendar'"
            (click)="viewMode = 'calendar'"
          >
            <i class="fas fa-calendar"></i>
            <span>Calendar</span>
          </button>
        </div>

        <div class="quick-stats">
          <div class="stat-item success">
            <i class="fas fa-arrow-up"></i>
            <span>₹{{ totalIncome | number : '1.0-0' }}</span>
          </div>
          <div class="stat-item danger">
            <i class="fas fa-arrow-down"></i>
            <span>₹{{ totalExpense | number : '1.0-0' }}</span>
          </div>
          <div class="stat-item info">
            <i class="fas fa-wallet"></i>
            <span>₹{{ totalIncome - totalExpense | number : '1.0-0' }}</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card filters-card">
        <div class="card-body">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label"> <i class="fas fa-filter me-2"></i>Type </label>
              <select class="form-select" [(ngModel)]="filters.type" (change)="applyFilters()">
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label"> <i class="fas fa-tag me-2"></i>Category </label>
              <select class="form-select" [(ngModel)]="filters.category" (change)="applyFilters()">
                <option value="">All Categories</option>
                <option *ngFor="let cat of allCategories" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-calendar-day me-2"></i>Start Date
              </label>
              <input
                type="date"
                class="form-control"
                [(ngModel)]="filters.startDate"
                (change)="applyFilters()"
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-calendar-check me-2"></i>End Date
              </label>
              <input
                type="date"
                class="form-control"
                [(ngModel)]="filters.endDate"
                (change)="applyFilters()"
              />
            </div>

            <div class="filter-group">
              <button class="btn btn-outline-primary" (click)="clearFilters()">
                <i class="fas fa-times me-2"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div *ngIf="viewMode === 'list'" class="list-view">
        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th class="text-end">Amount</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let transaction of transactions" class="transaction-row">
                    <td>
                      <div class="date-cell">
                        <i class="fas fa-calendar-alt"></i>
                        {{ transaction.date | date : 'MMM dd, yyyy' }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="type-badge"
                        [class.income]="transaction.type === 'income'"
                        [class.expense]="transaction.type === 'expense'"
                      >
                        <i
                          class="fas"
                          [class.fa-arrow-up]="transaction.type === 'income'"
                          [class.fa-arrow-down]="transaction.type === 'expense'"
                        ></i>
                        {{ transaction.type }}
                      </span>
                    </td>
                    <td>
                      <div class="category-cell">
                        <div
                          class="category-icon"
                          [style.background]="getCategoryColor(transaction.category)"
                        >
                          <i [class]="getCategoryIcon(transaction.category)"></i>
                        </div>
                        {{ transaction.category }}
                      </div>
                    </td>
                    <td>
                      <div class="description-cell">
                        {{ transaction.description || '—' }}
                      </div>
                    </td>
                    <td class="text-end">
                      <div
                        class="amount-cell"
                        [class.income]="transaction.type === 'income'"
                        [class.expense]="transaction.type === 'expense'"
                      >
                        {{ transaction.type === 'expense' ? '-' : '+' }}₹{{
                          transaction.amount | number : '1.2-2'
                        }}
                      </div>
                    </td>
                    <td class="text-end">
                      <div class="action-buttons">
                        <button
                          class="btn-icon btn-edit"
                          (click)="editTransaction(transaction)"
                          title="Edit"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          class="btn-icon btn-delete"
                          (click)="deleteTransaction(transaction._id!)"
                          title="Delete"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="transactions.length === 0">
                    <td colspan="6" class="empty-state-cell">
                      <div class="empty-state">
                        <i class="fas fa-inbox fa-3x"></i>
                        <h4>No Transactions Found</h4>
                        <p>Start by adding your first transaction</p>
                        <button class="btn btn-primary" (click)="showAddModal()">
                          <i class="fas fa-plus me-2"></i>Add Transaction
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar View -->
      <div *ngIf="viewMode === 'calendar'" class="calendar-view">
        <div class="card">
          <div class="card-header">
            <h5><i class="fas fa-calendar me-2"></i>{{ currentMonthName }} {{ currentYear }}</h5>
            <div class="calendar-nav">
              <button class="btn btn-sm btn-outline-primary" (click)="previousMonth()">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary" (click)="nextMonth()">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <div class="calendar-grid">
              <div class="calendar-header" *ngFor="let day of weekDays">
                {{ day }}
              </div>
              <div
                *ngFor="let day of calendarDays"
                class="calendar-day"
                [class.other-month]="!day.isCurrentMonth"
                [class.today]="day.isToday"
                [class.has-transactions]="day.transactions && day.transactions.length > 0"
              >
                <div class="day-number">{{ day.date }}</div>
                <div
                  class="day-transactions"
                  *ngIf="day.transactions && day.transactions.length > 0"
                >
                  <div
                    *ngFor="let transaction of day.transactions.slice(0, 3)"
                    class="mini-transaction"
                    [class.income]="transaction.type === 'income'"
                    [class.expense]="transaction.type === 'expense'"
                    (click)="editTransaction(transaction)"
                  >
                    <span class="mini-amount">
                      {{ transaction.type === 'expense' ? '-' : '+' }}₹{{
                        transaction.amount | number : '1.0-0'
                      }}
                    </span>
                  </div>
                  <div *ngIf="day.transactions.length > 3" class="more-transactions">
                    +{{ day.transactions.length - 3 }} more
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div
        class="modal fade"
        [class.show]="showModal"
        [style.display]="showModal ? 'block' : 'none'"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fas me-2" [class.fa-plus]="!editMode" [class.fa-edit]="editMode"></i>
                {{ editMode ? 'Edit Transaction' : 'Add Transaction' }}
              </h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #transactionForm="ngForm">
                <div class="mb-3">
                  <label class="form-label">Transaction Type</label>
                  <div class="type-selector">
                    <button
                      type="button"
                      class="type-btn"
                      [class.active]="currentTransaction.type === 'income'"
                      (click)="setTransactionType('income')"
                    >
                      <i class="fas fa-arrow-up"></i>
                      Income
                    </button>
                    <button
                      type="button"
                      class="type-btn"
                      [class.active]="currentTransaction.type === 'expense'"
                      (click)="setTransactionType('expense')"
                    >
                      <i class="fas fa-arrow-down"></i>
                      Expense
                    </button>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-tag"></i></span>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="currentTransaction.category"
                      name="category"
                      required
                      list="categoryList"
                      placeholder="Select or type category"
                    />
                    <datalist id="categoryList">
                      <option *ngFor="let cat of availableCategories" [value]="cat"></option>
                    </datalist>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <div class="input-group">
                    <span class="input-group-text">₹</span>
                    <input
                      type="number"
                      class="form-control"
                      [(ngModel)]="currentTransaction.amount"
                      name="amount"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Date</label>
                  <input
                    type="date"
                    class="form-control"
                    [(ngModel)]="currentTransaction.date"
                    name="date"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Description (Optional)</label>
                  <textarea
                    class="form-control"
                    [(ngModel)]="currentTransaction.description"
                    name="description"
                    rows="3"
                    placeholder="Add notes about this transaction..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button
                type="button"
                class="btn btn-primary"
                [disabled]="!transactionForm.valid || loading"
                (click)="saveTransaction()"
              >
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ editMode ? 'Update' : 'Save' }} Transaction
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
      .transactions-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Header */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .page-header h1 {
        font-size: 2rem;
        margin-bottom: 0.25rem;
        display: flex;
        align-items: center;
        color: var(--text-primary);
      }

      .page-header .text-muted {
        color: var(--text-secondary) !important;
      }

      /* Controls Bar */
      .controls-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .view-toggle {
        display: flex;
        gap: 0.5rem;
        background: var(--white);
        padding: 0.25rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
      }

      .toggle-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .toggle-btn:hover {
        background: var(--bg-color);
      }

      .toggle-btn.active {
        background: var(--primary-color);
        color: white;
      }

      .quick-stats {
        display: flex;
        gap: 1rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--white);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        font-weight: 600;
      }

      .stat-item.success {
        color: var(--success-color);
      }

      .stat-item.danger {
        color: var(--danger-color);
      }

      .stat-item.info {
        color: var(--info-color);
      }

      /* Filters */
      .filters-card {
        margin-bottom: 1.5rem;
      }

      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        align-items: end;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .filter-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
      }

      /* Table Styles */
      .table {
        margin: 0;
      }

      .table thead th {
        background: var(--bg-color);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
        color: var(--text-secondary);
        padding: 1rem 1.5rem;
        border: none;
      }

      .table tbody td {
        padding: 1.25rem 1.5rem;
        vertical-align: middle;
        border-bottom: 1px solid var(--border-color);
      }

      .transaction-row {
        transition: all var(--transition-fast);
      }

      .transaction-row:hover {
        background: var(--bg-color);
      }

      .date-cell {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .type-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.875rem;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: capitalize;
      }

      .type-badge.income {
        background: rgba(72, 187, 120, 0.1);
        color: var(--success-color);
      }

      .type-badge.expense {
        background: rgba(245, 101, 101, 0.1);
        color: var(--danger-color);
      }

      .category-cell {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
      }

      .category-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.875rem;
      }

      .description-cell {
        color: var(--text-secondary);
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .amount-cell {
        font-size: 1.125rem;
        font-weight: 700;
      }

      .amount-cell.income {
        color: var(--success-color);
      }

      .amount-cell.expense {
        color: var(--danger-color);
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }

      .btn-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .btn-edit {
        background: rgba(66, 153, 225, 0.1);
        color: var(--info-color);
      }

      .btn-edit:hover {
        background: var(--info-color);
        color: white;
      }

      .btn-delete {
        background: rgba(245, 101, 101, 0.1);
        color: var(--danger-color);
      }

      .btn-delete:hover {
        background: var(--danger-color);
        color: white;
      }

      /* Calendar View */
      .calendar-view .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .calendar-nav {
        display: flex;
        gap: 0.5rem;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: 1px solid var(--border-color);
      }

      .calendar-header {
        padding: 1rem;
        text-align: center;
        font-weight: 700;
        font-size: 0.875rem;
        color: var(--text-secondary);
        background: var(--bg-color);
        border-bottom: 2px solid var(--border-color);
      }

      .calendar-day {
        min-height: 120px;
        padding: 0.75rem;
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        transition: background var(--transition-fast);
        position: relative;
      }

      .calendar-day:nth-child(7n) {
        border-right: none;
      }

      .calendar-day.other-month {
        background: var(--bg-secondary);
        opacity: 0.5;
      }

      .calendar-day.today {
        background: rgba(102, 126, 234, 0.05);
      }

      .calendar-day.today .day-number {
        background: var(--primary-color);
        color: white;
      }

      .calendar-day:hover {
        background: var(--bg-color);
      }

      .day-number {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }

      .day-transactions {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .mini-transaction {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .mini-transaction.income {
        background: rgba(72, 187, 120, 0.1);
        color: var(--success-color);
      }

      .mini-transaction.expense {
        background: rgba(245, 101, 101, 0.1);
        color: var(--danger-color);
      }

      .mini-transaction:hover {
        transform: translateX(3px);
      }

      .more-transactions {
        font-size: 0.625rem;
        color: var(--text-muted);
        text-align: center;
        margin-top: 0.25rem;
      }

      /* Modal Styles */
      .type-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .type-btn {
        padding: 1rem;
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        background: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .type-btn:hover {
        border-color: var(--primary-color);
      }

      .type-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
      }

      /* Empty State */
      .empty-state-cell {
        padding: 4rem 2rem !important;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: var(--text-muted);
      }

      .empty-state i {
        margin-bottom: 1.5rem;
        opacity: 0.5;
      }

      .empty-state h4 {
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }

      .empty-state p {
        color: var(--text-muted);
        margin-bottom: 1.5rem;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .calendar-day {
          min-height: 100px;
        }
      }

      @media (max-width: 768px) {
        .controls-bar {
          flex-direction: column;
          align-items: stretch;
        }

        .quick-stats {
          justify-content: space-between;
        }

        .filters-grid {
          grid-template-columns: 1fr;
        }

        .table thead {
          display: none;
        }

        .table tbody tr {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
        }

        .table tbody td {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .table tbody td:last-child {
          border-bottom: none;
        }

        .table tbody td::before {
          content: attr(data-label);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .calendar-grid {
          grid-template-columns: repeat(7, 1fr);
          font-size: 0.75rem;
        }

        .calendar-day {
          min-height: 80px;
          padding: 0.5rem;
        }
      }
    `,
  ],
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  showModal = false;
  editMode = false;
  loading = false;
  viewMode: 'list' | 'calendar' = 'list';

  currentTransaction: Transaction = this.getEmptyTransaction();

  filters = {
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  };

  allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  availableCategories: string[] = EXPENSE_CATEGORIES;

  totalIncome = 0;
  totalExpense = 0;

  // Calendar properties
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: any[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  get currentMonthName(): string {
    const months = [
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
    return months[this.currentMonth];
  }

  loadTransactions(): void {
    this.transactionService.getTransactions(this.filters).subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.calculateTotals();
        this.generateCalendar();
      },
      error: (error) => console.error('Error loading transactions:', error),
    });
  }

  calculateTotals(): void {
    this.totalIncome = this.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpense = this.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        transactions: [],
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();

      const dayTransactions = this.transactions.filter((t) => {
        const transDate = new Date(t.date);
        return (
          transDate.getDate() === day &&
          transDate.getMonth() === this.currentMonth &&
          transDate.getFullYear() === this.currentYear
        );
      });

      this.calendarDays.push({
        date: day,
        isCurrentMonth: true,
        isToday,
        transactions: dayTransactions,
      });
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      this.calendarDays.push({
        date: day,
        isCurrentMonth: false,
        isToday: false,
        transactions: [],
      });
    }
  }

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  applyFilters(): void {
    this.loadTransactions();
  }

  clearFilters(): void {
    this.filters = {
      type: '',
      category: '',
      startDate: '',
      endDate: '',
    };
    this.loadTransactions();
  }

  showAddModal(): void {
    this.editMode = false;
    this.currentTransaction = this.getEmptyTransaction();
    this.availableCategories = EXPENSE_CATEGORIES;
    this.showModal = true;
  }

  editTransaction(transaction: Transaction): void {
    this.editMode = true;
    this.currentTransaction = { ...transaction };
    this.onTypeChange();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentTransaction = this.getEmptyTransaction();
  }

  setTransactionType(type: 'income' | 'expense'): void {
    this.currentTransaction.type = type;
    this.onTypeChange();
  }

  onTypeChange(): void {
    this.availableCategories =
      this.currentTransaction.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    this.currentTransaction.category = this.availableCategories[0];
  }

  saveTransaction(): void {
    this.loading = true;

    if (this.editMode && this.currentTransaction._id) {
      this.transactionService
        .updateTransaction(this.currentTransaction._id, this.currentTransaction)
        .subscribe({
          next: () => {
            this.loadTransactions();
            this.closeModal();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating transaction:', error);
            this.loading = false;
          },
        });
    } else {
      this.transactionService.createTransaction(this.currentTransaction).subscribe({
        next: () => {
          this.loadTransactions();
          this.closeModal();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
          this.loading = false;
        },
      });
    }
  }

  deleteTransaction(id: string): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (error) => console.error('Error deleting transaction:', error),
      });
    }
  }

  getEmptyTransaction(): Transaction {
    return {
      type: 'expense',
      amount: 0,
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0],
    };
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Food: '#667eea',
      Transport: '#f093fb',
      Entertainment: '#4facfe',
      Shopping: '#43e97b',
      Healthcare: '#fa709a',
      Education: '#fee140',
      Bills: '#30cfd0',
      Salary: '#48bb78',
      Freelance: '#4299e1',
      Investment: '#ed8936',
      Other: '#a8edea',
    };
    return colors[category] || '#667eea';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      Food: 'fas fa-utensils',
      Transport: 'fas fa-car',
      Entertainment: 'fas fa-film',
      Shopping: 'fas fa-shopping-bag',
      Healthcare: 'fas fa-heartbeat',
      Education: 'fas fa-graduation-cap',
      Bills: 'fas fa-file-invoice-dollar',
      Salary: 'fas fa-briefcase',
      Freelance: 'fas fa-laptop-code',
      Investment: 'fas fa-chart-line',
      Other: 'fas fa-ellipsis-h',
    };
    return icons[category] || 'fas fa-circle';
  }
}