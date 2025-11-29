import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction, TransactionStats } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  //private readonly API_URL = 'http://localhost:3000/api/transactions';
  private readonly API_URL = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getTransactions(filters?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<{ success: boolean; data: Transaction[] }> {
    let params = new HttpParams();

    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
    }

    return this.http.get<{ success: boolean; data: Transaction[] }>(this.API_URL, { params });
  }

  createTransaction(transaction: Transaction): Observable<{ success: boolean; data: Transaction }> {
    return this.http.post<{ success: boolean; data: Transaction }>(this.API_URL, transaction);
  }

  updateTransaction(
    id: string,
    transaction: Partial<Transaction>
  ): Observable<{ success: boolean; data: Transaction }> {
    return this.http.put<{ success: boolean; data: Transaction }>(
      `${this.API_URL}/${id}`,
      transaction
    );
  }

  deleteTransaction(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

  getStatistics(
    month?: number,
    year?: number
  ): Observable<{ success: boolean; data: TransactionStats }> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<{ success: boolean; data: TransactionStats }>(
      `${this.API_URL}/statistics`,
      { params }
    );
  }
}
