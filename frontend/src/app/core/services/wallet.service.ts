import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Wallet {
  _id: string;
  userId: string;
  name: string;
  type: 'cash' | 'bank' | 'upi' | 'card' | 'e-wallet';
  balance: number;
  currency: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isActive: boolean;
  metadata?: {
    bankName?: string;
    cardLast4?: string;
    upiId?: string;
    accountNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiUrl = `${environment.apiUrl}/wallets`;

  constructor(private http: HttpClient) {}

  getWallets(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getWallet(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createWallet(wallet: Partial<Wallet>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, wallet);
  }

  updateWallet(id: string, wallet: Partial<Wallet>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, wallet);
  }

  deleteWallet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  transferBetweenWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    description?: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, {
      fromWalletId,
      toWalletId,
      amount,
      description,
    });
  }
}
