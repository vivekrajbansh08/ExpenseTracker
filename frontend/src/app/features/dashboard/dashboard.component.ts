// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TransactionService } from '../../core/services/transaction.service';
// import { BudgetService } from '../../core/services/budget.service';
// import { TransactionStats } from '../../shared/models/transaction.model';
// import { BudgetProgress } from '../../shared/models/budget.model';
// import { BaseChartDirective } from 'ng2-charts';
// import { ChartConfiguration } from 'chart.js';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, BaseChartDirective],
//   template: `
//     <div class="container mt-4">
//       <div class="row mb-4">
//         <div class="col-md-12">
//           <h2><i class="fas fa-chart-line me-2"></i>Dashboard</h2>
//         </div>
//       </div>

//       <!-- Month/Year Selector -->
//       <div class="row mb-4">
//         <div class="col-md-6">
//           <div class="input-group">
//             <label class="input-group-text">Month</label>
//             <select class="form-select" [(ngModel)]="selectedMonth" (change)="loadData()">
//               <option *ngFor="let month of months; let i = index" [value]="i + 1">
//                 {{ month }}
//               </option>
//             </select>
//             <label class="input-group-text">Year</label>
//             <select class="form-select" [(ngModel)]="selectedYear" (change)="loadData()">
//               <option *ngFor="let year of years" [value]="year">{{ year }}</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <!-- Summary Cards -->
//       <div class="row mb-4">
//         <div class="col-md-4 mb-3">
//           <div class="stat-card bg-success">
//             <div class="stat-icon">
//               <i class="fas fa-arrow-up"></i>
//             </div>
//             <div class="stat-info">
//               <h3>₹{{ totalIncome | number : '1.2-2' }}</h3>
//               <p>Total Income</p>
//             </div>
//           </div>
//         </div>

//         <div class="col-md-4 mb-3">
//           <div class="stat-card bg-danger">
//             <div class="stat-icon">
//               <i class="fas fa-arrow-down"></i>
//             </div>
//             <div class="stat-info">
//               <h3>₹{{ totalExpense | number : '1.2-2' }}</h3>
//               <p>Total Expense</p>
//             </div>
//           </div>
//         </div>

//         <div class="col-md-4 mb-3">
//           <div class="stat-card" [class.bg-success]="balance >= 0" [class.bg-warning]="balance < 0">
//             <div class="stat-icon">
//               <i class="fas fa-wallet"></i>
//             </div>
//             <div class="stat-info">
//               <h3>₹{{ balance | number : '1.2-2' }}</h3>
//               <p>Balance</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Charts -->
//       <div class="row mb-4">
//         <div class="col-md-6 mb-3">
//           <div class="card">
//             <div class="card-header">
//               <h5 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Expense by Category</h5>
//             </div>
//             <div class="card-body">
//               <canvas
//                 *ngIf="pieChartData.labels && pieChartData.labels.length > 0"
//                 baseChart
//                 [data]="pieChartData"
//                 [options]="pieChartOptions"
//                 [type]="'pie'"
//               ></canvas>
//               <p
//                 *ngIf="!pieChartData.labels || pieChartData.labels.length === 0"
//                 class="text-center text-muted"
//               >
//                 No expense data available
//               </p>
//             </div>
//           </div>
//         </div>

//         <div class="col-md-6 mb-3">
//           <div class="card">
//             <div class="card-header">
//               <h5 class="mb-0"><i class="fas fa-list me-2"></i>Top Categories</h5>
//             </div>
//             <div class="card-body">
//               <div *ngIf="categoryBreakdown.length > 0">
//                 <div
//                   *ngFor="let category of categoryBreakdown.slice(0, 5)"
//                   class="category-item mb-3"
//                 >
//                   <div class="d-flex justify-content-between align-items-center mb-1">
//                     <span class="fw-bold">{{ category._id }}</span>
//                     <span class="text-primary">₹{{ category.total | number : '1.2-2' }}</span>
//                   </div>
//                   <div class="progress" style="height: 8px;">
//                     <div
//                       class="progress-bar"
//                       [style.width.%]="(category.total / totalExpense) * 100"
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//               <p *ngIf="categoryBreakdown.length === 0" class="text-center text-muted">
//                 No category data available
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <!-- Budget Progress -->
//       <div class="row" *ngIf="budgetProgress.length > 0">
//         <div class="col-md-12">
//           <div class="card">
//             <div class="card-header">
//               <h5 class="mb-0"><i class="fas fa-piggy-bank me-2"></i>Budget Progress</h5>
//             </div>
//             <div class="card-body">
//               <div *ngFor="let progress of budgetProgress" class="budget-progress-item mb-4">
//                 <div class="d-flex justify-content-between mb-2">
//                   <h6 class="mb-0">{{ progress.budget.category }}</h6>
//                   <span
//                     class="badge"
//                     [class.bg-success]="progress.percentage <= 75"
//                     [class.bg-warning]="progress.percentage > 75 && progress.percentage <= 100"
//                     [class.bg-danger]="progress.percentage > 100"
//                   >
//                     {{ progress.percentage }}%
//                   </span>
//                 </div>
//                 <div class="progress mb-2" style="height: 20px;">
//                   <div
//                     class="progress-bar"
//                     [class.bg-success]="progress.percentage <= 75"
//                     [class.bg-warning]="progress.percentage > 75 && progress.percentage <= 100"
//                     [class.bg-danger]="progress.percentage > 100"
//                     [style.width.%]="progress.percentage > 100 ? 100 : progress.percentage"
//                   >
//                     ₹{{ progress.spent | number : '1.0-0' }} / ₹{{
//                       progress.budget.amount | number : '1.0-0'
//                     }}
//                   </div>
//                 </div>
//                 <small class="text-muted">
//                   Remaining: ₹{{ progress.remaining | number : '1.2-2' }}
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [
//     `
//       .stat-card {
//         padding: 24px;
//         border-radius: 12px;
//         color: white;
//         display: flex;
//         align-items: center;
//         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//       }
//       .stat-icon {
//         font-size: 48px;
//         margin-right: 20px;
//         opacity: 0.9;
//       }
//       .stat-info h3 {
//         font-size: 28px;
//         font-weight: 700;
//         margin: 0;
//       }
//       .stat-info p {
//         margin: 0;
//         font-size: 14px;
//         opacity: 0.9;
//       }
//       .card {
//         border: none;
//         box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//         border-radius: 12px;
//       }
//       .card-header {
//         background: white;
//         border-bottom: 1px solid #e9ecef;
//         padding: 16px 20px;
//       }
//       .category-item {
//         transition: transform 0.2s;
//       }
//       .category-item:hover {
//         transform: translateX(5px);
//       }
//     `,
//   ],
// })
// export class DashboardComponent implements OnInit {
//   selectedMonth = new Date().getMonth() + 1;
//   selectedYear = new Date().getFullYear();

//   months = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

//   totalIncome = 0;
//   totalExpense = 0;
//   balance = 0;
//   categoryBreakdown: any[] = [];
//   budgetProgress: BudgetProgress[] = [];

//   pieChartData: ChartConfiguration<'pie'>['data'] = {
//     labels: [],
//     datasets: [{ data: [] }],
//   };

//   pieChartOptions: ChartConfiguration<'pie'>['options'] = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'bottom',
//       },
//     },
//   };

//   constructor(
//     private transactionService: TransactionService,
//     private budgetService: BudgetService
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData(): void {
//     this.loadStatistics();
//     this.loadBudgetProgress();
//   }

//   loadStatistics(): void {
//     this.transactionService.getStatistics(this.selectedMonth, this.selectedYear).subscribe({
//       next: (response) => {
//         const stats = response.data;

//         this.totalIncome = stats.summary.find((s: any) => s._id === 'income')?.total || 0;
//         this.totalExpense = stats.summary.find((s: any) => s._id === 'expense')?.total || 0;
//         this.balance = this.totalIncome - this.totalExpense;

//         this.categoryBreakdown = stats.categoryBreakdown;

//         // Update pie chart
//         this.pieChartData = {
//           labels: stats.categoryBreakdown.map((c: any) => c._id),
//           datasets: [
//             {
//               data: stats.categoryBreakdown.map((c: any) => c.total),
//               backgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//                 '#4BC0C0',
//                 '#9966FF',
//                 '#FF9F40',
//                 '#FF6384',
//                 '#C9CBCF',
//               ],
//             },
//           ],
//         };
//       },
//       error: (error) => console.error('Error loading statistics:', error),
//     });
//   }

//   loadBudgetProgress(): void {
//     this.budgetService.getBudgetProgress(this.selectedMonth, this.selectedYear).subscribe({
//       next: (response) => {
//         this.budgetProgress = response.data;
//       },
//       error: (error) => console.error('Error loading budget progress:', error),
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { BudgetService } from '../../core/services/budget.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { TransactionStats } from '../../shared/models/transaction.model';
import { BudgetProgress } from '../../shared/models/budget.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1><i class="fas fa-chart-line me-2"></i>Dashboard</h1>
          <p class="text-muted">Overview of your financial status</p>
        </div>

        <!-- Time Range Selector -->
        <div class="date-selector">
          <select class="form-select" [(ngModel)]="timeRange" (change)="onTimeRangeChange()">
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <div *ngIf="timeRange === 'custom'" class="d-flex gap-2">
            <input type="date" class="form-control" [(ngModel)]="customStartDate" (change)="loadData()">
            <input type="date" class="form-control" [(ngModel)]="customEndDate" (change)="loadData()">
          </div>

          <div *ngIf="timeRange === 'month'" class="d-flex gap-2">
            <select class="form-select" [(ngModel)]="selectedMonth" (change)="loadData()">
              <option *ngFor="let month of months; let i = index" [value]="i + 1">
                {{ month }}
              </option>
            </select>
            <select class="form-select" [(ngModel)]="selectedYear" (change)="loadData()">
              <option *ngFor="let year of years" [value]="year">{{ year }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="stats-grid">
        <div class="stat-card success">
          <div class="stat-icon">
            <i class="fas fa-arrow-up"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹{{ totalIncome | number : '1.2-2' }}</div>
            <div class="stat-label">Total Income</div>
          </div>
        </div>

        <div class="stat-card danger">
          <div class="stat-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹{{ totalExpense | number : '1.2-2' }}</div>
            <div class="stat-label">Total Expense</div>
          </div>
        </div>

        <div class="stat-card" [ngClass]="balance >= 0 ? 'info' : 'warning'">
          <div class="stat-icon">
            <i class="fas fa-wallet"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹{{ balance | number : '1.2-2' }}</div>
            <div class="stat-label">Balance</div>
          </div>
        </div>

        <div class="stat-card primary">
          <div class="stat-icon">
            <i class="fas fa-calculator"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ transactionCount }}</div>
            <div class="stat-label">Transactions</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Pie Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h5><i class="fas fa-chart-pie me-2"></i>Expense by Category</h5>
          </div>
          <div class="card-body">
            <div
              class="chart-container"
              *ngIf="pieChartData.labels && pieChartData.labels.length > 0"
            >
              <canvas
                baseChart
                [data]="pieChartData"
                [options]="pieChartOptions"
                [type]="'pie'"
              ></canvas>
            </div>
            <div
              *ngIf="!pieChartData.labels || pieChartData.labels.length === 0"
              class="empty-state"
            >
              <i class="fas fa-chart-pie fa-3x"></i>
              <p>No expense data available</p>
              <small>Add some expenses to see the breakdown</small>
            </div>
          </div>
        </div>

        <!-- Category List -->
        <div class="card chart-card">
          <div class="card-header">
            <h5><i class="fas fa-list-ul me-2"></i>Top Categories</h5>
          </div>
          <div class="card-body">
            <div class="category-list" *ngIf="categoryBreakdown.length > 0">
              <div
                *ngFor="let category of categoryBreakdown.slice(0, 5); let i = index"
                class="category-item"
              >
                <div class="category-info">
                  <div class="category-icon" [style.background]="getCategoryColor(i)">
                    <i [class]="getCategoryIcon(category._id)"></i>
                  </div>
                  <div class="category-details">
                    <div class="category-name">{{ category._id }}</div>
                    <div class="category-count">{{ category.count }} transactions</div>
                  </div>
                </div>
                <div class="category-stats">
                  <div class="category-amount">₹{{ category.total | number : '1.0-0' }}</div>
                  <div class="category-percentage">
                    {{ (category.total / totalExpense) * 100 | number : '1.0-0' }}%
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="categoryBreakdown.length === 0" class="empty-state">
              <i class="fas fa-list-ul fa-3x"></i>
              <p>No category data available</p>
              <small>Expenses will be categorized here</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Progress -->
      <div class="card" *ngIf="budgetProgress.length > 0">
        <div class="card-header">
          <h5><i class="fas fa-piggy-bank me-2"></i>Budget Progress</h5>
          <span class="badge bg-primary">{{ budgetProgress.length }} budgets</span>
        </div>
        <div class="card-body">
          <div class="budget-grid">
            <div *ngFor="let progress of budgetProgress" class="budget-item">
              <div class="budget-header">
                <div>
                  <h6 class="budget-category">{{ progress.budget.category }}</h6>
                  <small class="text-muted">
                    ₹{{ progress.spent | number : '1.0-0' }} of ₹{{
                      progress.budget.amount | number : '1.0-0'
                    }}
                  </small>
                </div>
                <span
                  class="badge"
                  [class.bg-success]="progress.percentage <= 75"
                  [class.bg-warning]="progress.percentage > 75 && progress.percentage <= 100"
                  [class.bg-danger]="progress.percentage > 100"
                >
                  {{ progress.percentage }}%
                </span>
              </div>
              <div class="progress" style="height: 12px; margin: 1rem 0;">
                <div
                  class="progress-bar"
                  [class.bg-success]="progress.percentage <= 75"
                  [class.bg-warning]="progress.percentage > 75 && progress.percentage <= 100"
                  [class.bg-danger]="progress.percentage > 100"
                  [style.width.%]="progress.percentage > 100 ? 100 : progress.percentage"
                ></div>
              </div>
              <div class="budget-footer">
                <span
                  [class.text-success]="progress.remaining > 0"
                  [class.text-danger]="progress.remaining < 0"
                >
                  <i
                    class="fas"
                    [class.fa-check-circle]="progress.remaining > 0"
                    [class.fa-exclamation-triangle]="progress.remaining < 0"
                  ></i>
                  {{ progress.remaining >= 0 ? 'Remaining' : 'Exceeded' }}: ₹{{
                    Math.abs(progress.remaining) | number : '1.0-0'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Budget State -->
      <div class="card" *ngIf="budgetProgress.length === 0">
        <div class="card-body">
          <div class="empty-state">
            <i class="fas fa-piggy-bank fa-4x"></i>
            <h4>No Budgets Set</h4>
            <p>Start planning your finances by setting monthly budgets</p>
            <a routerLink="/budget" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Create Budget
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Page Header */
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

      .date-selector {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .date-selector .form-select {
        min-width: 120px;
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 1.75rem;
        border-radius: var(--radius-xl);
        color: #747171;
        background: var(--glass-bg-heavy);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-base);
        position: relative;
        overflow: hidden;
        border: 1.5px solid var(--glass-border);
      }

      /* Animated neon border on hover */
      .stat-card::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: var(--gradient-neon);
        border-radius: var(--radius-xl);
        z-index: -1;
        opacity: 0;
        transition: opacity var(--transition-base);
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
        transition: all var(--transition-slow);
      }

      .stat-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: var(--shadow-xl);
      }

      .stat-card:hover::after {
        opacity: 0.5;
      }

      .stat-card:hover::before {
        transform: scale(1.2) rotate(30deg);
      }

      .stat-card.success {
        background: linear-gradient(135deg, rgba(72, 187, 120, 0.3) 0%, rgba(56, 161, 105, 0.3) 100%);
      }

      .stat-card.success:hover {
        box-shadow: var(--shadow-xl), var(--glow-success);
      }

      .stat-card.danger {
        background: linear-gradient(135deg, rgba(245, 101, 101, 0.3) 0%, rgba(229, 62, 62, 0.3) 100%);
      }

      .stat-card.danger:hover {
        box-shadow: var(--shadow-xl), var(--glow-danger);
      }

      .stat-card.warning {
        background: linear-gradient(135deg, rgba(237, 137, 54, 0.3) 0%, rgba(221, 107, 32, 0.3) 100%);
      }

      .stat-card.info {
        background: linear-gradient(135deg, rgba(66, 153, 225, 0.3) 0%, rgba(49, 130, 206, 0.3) 100%);
      }

      .stat-card.primary {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
      }

      .stat-card.primary:hover {
        box-shadow: var(--shadow-xl), var(--glow-primary);
      }

      .stat-icon {
        font-size: 3rem;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }

      .stat-content {
        flex: 1;
        position: relative;
        z-index: 1;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }

      .stat-label {
        font-size: 0.875rem;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* Charts Grid */
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .chart-card {
        height: 420px;
        display: flex;
        flex-direction: column;
      }

      .chart-card .card-body {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .chart-container {
        width: 100%;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Category List - Two Column Grid */
      .category-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        max-height: 500px;
        overflow-y: auto;
        padding-right: 0.5rem;
      }

      /* Custom scrollbar for category list */
      .category-list::-webkit-scrollbar {
        width: 6px;
      }

      .category-list::-webkit-scrollbar-track {
        background: var(--bg-secondary);
        border-radius: 3px;
      }

      .category-list::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 3px;
      }

      .category-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--bg-color);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        border: 1px solid var(--border-color);
      }

      .category-item:hover {
        background: var(--bg-secondary);
        transform: translateX(5px);
      }

      .category-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .category-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.25rem;
      }

      .category-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .category-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .category-count {
        font-size: 0.875rem;
        color: var(--text-muted);
      }

      .category-stats {
        flex: 1;
        text-align: right;
      }

      .category-amount {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
      }

      .category-percentage {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      /* Responsive Grid */
      @media (max-width: 768px) {
        .category-list {
          grid-template-columns: 1fr;
        }
      }

      /* Budget Grid */
      .budget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .budget-item {
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        background: var(--surface-bg);
      }

      .budget-item:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-md);
      }

      .budget-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .budget-category {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .budget-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
      }

      /* Empty State */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
        color: var(--text-muted);
      }

      .empty-state i {
        margin-bottom: 1rem;
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
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .page-header {
          flex-direction: column;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .budget-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  timeRange = 'month';
  customStartDate = '';
  customEndDate = '';
  Math = Math;

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

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  transactionCount = 0;
  categoryBreakdown: any[] = [];
  budgetProgress: BudgetProgress[] = [];

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }],
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'inherit',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  onTimeRangeChange(): void {
    if (this.timeRange !== 'custom') {
      this.loadData();
    }
  }

  loadData(): void {
    if (this.timeRange === 'month') {
      this.loadMonthlyStatistics();
      this.loadBudgetProgress();
    } else {
      this.loadTimeframeStatistics();
      this.budgetProgress = []; // Clear budget progress for non-monthly views
    }
  }

  loadMonthlyStatistics(): void {
    this.transactionService.getStatistics(this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        const stats = response.data;

        this.totalIncome = stats.summary.find((s: any) => s._id === 'income')?.total || 0;
        this.totalExpense = stats.summary.find((s: any) => s._id === 'expense')?.total || 0;
        this.balance = this.totalIncome - this.totalExpense;
        this.transactionCount = stats.categoryBreakdown.reduce((acc: number, curr: any) => acc + curr.count, 0);

        this.categoryBreakdown = stats.categoryBreakdown;
        this.updateCharts();
      },
      error: (error) => console.error('Error loading statistics:', error),
    });
  }

  loadTimeframeStatistics(): void {
    let startDate: Date;
    let endDate: Date;

    if (this.timeRange === 'week') {
      // Get start of 7 days ago in UTC
      const now = new Date();
      startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7, 0, 0, 0, 0));
      // Get end of today in UTC
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    } else if (this.timeRange === 'year') {
      // Get start of current year in UTC
      const now = new Date();
      startDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
      // Get end of today in UTC
      endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    } else if (this.timeRange === 'custom') {
      if (!this.customStartDate || !this.customEndDate) return;
      // Parse custom dates and set to start/end of day in UTC
      const start = new Date(this.customStartDate);
      startDate = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0));
      const end = new Date(this.customEndDate);
      endDate = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59, 999));
    } else {
      return;
    }

    console.log('Timeframe API Call:', {
      timeRange: this.timeRange,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startDateLocal: startDate.toString(),
      endDateLocal: endDate.toString()
    });

    this.analyticsService.getTimeframeAnalysis(startDate.toISOString(), endDate.toISOString()).subscribe({
      next: (response) => {
        const data = response.data;
        this.totalIncome = data.summary.totalIncome;
        this.totalExpense = data.summary.totalExpenses;
        this.balance = data.summary.netBalance;
        this.transactionCount = data.summary.transactionCount;
        
        // Map category breakdown to match the structure expected by the template
        this.categoryBreakdown = data.categoryBreakdown.map((c: any) => ({
          _id: c.category,
          total: c.amount,
          count: c.count || 0 // Count might not be available in this endpoint, or I need to check the response structure
        }));

        this.updateCharts();
      },
      error: (error) => console.error('Error loading timeframe stats:', error)
    });
  }

  loadBudgetProgress(): void {
    this.budgetService.getBudgetProgress(this.selectedMonth, this.selectedYear).subscribe({
      next: (response) => {
        this.budgetProgress = response.data;
      },
      error: (error) => console.error('Error loading budget progress:', error),
    });
  }

  updateCharts(): void {
    this.pieChartData = {
      labels: this.categoryBreakdown.map((c: any) => c._id),
      datasets: [
        {
          data: this.categoryBreakdown.map((c: any) => c.total),
          backgroundColor: [
            '#667eea',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a',
            '#fee140',
            '#30cfd0',
            '#a8edea',
          ],
          borderWidth: 0,
        },
      ],
    };
  }

  getCategoryColor(index: number): string {
    const colors = [
      '#667eea',
      '#f093fb',
      '#4facfe',
      '#43e97b',
      '#fa709a',
      '#fee140',
      '#30cfd0',
      '#a8edea',
    ];
    return colors[index % colors.length];
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
      Other: 'fas fa-ellipsis-h',
    };
    return icons[category] || 'fas fa-tag';
  }
}