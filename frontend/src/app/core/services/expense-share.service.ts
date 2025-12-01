import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExpenseShare {
  _id: string;
  transactionId: string;
  groupId?: string;
  paidBy: any;
  totalAmount: number;
  splits: Array<{
    userId?: any;           // Optional - for registered users
    email: string;          // Required - for all participants
    amount: number;
    paid: boolean;
    isPending?: boolean;    // True if user not registered
    paidAt?: Date;
  }>;
  isSettled: boolean;
  settledAt?: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseShareService {
  private apiUrl = `${environment.apiUrl}/expense-shares`;

  constructor(private http: HttpClient) {}

  getExpenseShares(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getExpenseShare(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createExpenseShare(share: Partial<ExpenseShare>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, share);
  }

  updateExpenseShare(id: string, share: Partial<ExpenseShare>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, share);
  }

  deleteExpenseShare(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  settleSplit(id: string, splitUserId: string, splitId?: string): Observable<any> {
    const body: any = { splitUserId };
    if (splitId) {
      body.splitId = splitId;
    }
    return this.http.put(`${this.apiUrl}/${id}/settle`, body);
  }

  getBalances(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balances`);
  }
}
