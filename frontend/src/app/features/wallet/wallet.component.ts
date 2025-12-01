import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService, Wallet } from '../../core/services/wallet.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-wallet me-2"></i>Wallets</h2>
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <i class="fas fa-plus me-2"></i>Add Wallet
        </button>
      </div>

      <!-- Wallet List -->
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let wallet of wallets">
          <div class="card h-100" [style.border-left]="'5px solid ' + wallet.color">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h5 class="card-title mb-0">{{ wallet.name }}</h5>
                <span class="badge bg-secondary">{{ wallet.type }}</span>
              </div>
              <h3 class="card-text mb-3">
                {{ wallet.currency }} {{ wallet.balance | number : '1.2-2' }}
              </h3>
              <div class="text-muted small">
                <i class="fas fa-clock me-1"></i>
                Updated: {{ wallet.updatedAt | date }}
              </div>
            </div>
            <div class="card-footer bg-transparent border-top-0 text-end">
              <button class="btn btn-sm btn-outline-primary me-2" (click)="editWallet(wallet)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deleteWallet(wallet._id)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="wallets.length === 0 && !loading" class="text-center py-5">
        <i class="fas fa-wallet fa-3x text-muted mb-3"></i>
        <p class="text-muted">No wallets found. Create one to get started!</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Create/Edit Modal (Simple Overlay for now) -->
      <div class="modal-backdrop fade show" *ngIf="showCreateModal"></div>
      <div class="modal fade show d-block" *ngIf="showCreateModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditing ? 'Edit Wallet' : 'Add New Wallet' }}</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Wallet Name</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="currentWallet.name"
                    name="name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Type</label>
                  <select
                    class="form-select"
                    [(ngModel)]="currentWallet.type"
                    name="type"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Account</option>
                    <option value="card">Credit Card</option>
                    <option value="e-wallet">E-Wallet</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Initial Balance</label>
                  <input
                    type="number"
                    class="form-control"
                    [(ngModel)]="currentWallet.balance"
                    name="balance"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Currency</label>
                  <select
                    class="form-select"
                    [(ngModel)]="currentWallet.currency"
                    name="currency"
                    required
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Color</label>
                  <input
                    type="color"
                    class="form-control form-control-color"
                    [(ngModel)]="currentWallet.color"
                    name="color"
                  />
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">
                    {{ isEditing ? 'Update Wallet' : 'Create Wallet' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        transition: transform 0.2s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .card:hover {
        transform: translateY(-5px);
      }
      .form-control-color {
        width: 100%;
      }
    `,
  ],
})
export class WalletComponent implements OnInit {
  wallets: Wallet[] = [];
  loading = false;
  showCreateModal = false;
  isEditing = false;

  currentWallet: Partial<Wallet> = {
    name: '',
    type: 'cash',
    balance: 0,
    currency: 'INR',
    color: '#48bb78',
  };

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.loadWallets();
  }

  loadWallets(): void {
    this.loading = true;
    this.walletService.getWallets().subscribe({
      next: (response) => {
        this.wallets = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wallets:', error);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.isEditing && this.currentWallet._id) {
      this.walletService
        .updateWallet(this.currentWallet._id, this.currentWallet)
        .subscribe({
          next: () => {
            this.loadWallets();
            this.closeModal();
          },
          error: (error) => console.error('Error updating wallet:', error),
        });
    } else {
      this.walletService.createWallet(this.currentWallet).subscribe({
        next: () => {
          this.loadWallets();
          this.closeModal();
        },
        error: (error) => console.error('Error creating wallet:', error),
      });
    }
  }

  editWallet(wallet: Wallet): void {
    this.currentWallet = { ...wallet };
    this.isEditing = true;
    this.showCreateModal = true;
  }

  deleteWallet(id: string): void {
    if (confirm('Are you sure you want to delete this wallet?')) {
      this.walletService.deleteWallet(id).subscribe({
        next: () => this.loadWallets(),
        error: (error) => console.error('Error deleting wallet:', error),
      });
    }
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.isEditing = false;
    this.currentWallet = {
      name: '',
      type: 'cash',
      balance: 0,
      currency: 'INR',
      color: '#48bb78',
    };
  }
}
