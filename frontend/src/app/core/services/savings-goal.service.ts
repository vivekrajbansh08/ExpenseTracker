import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SavingsGoal {
  _id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: Date;
  icon?: string;
  color?: string;
  progress: Array<{
    amount: number;
    date: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SavingsGoalService {
  private apiUrl = `${environment.apiUrl}/savings-goals`;

  constructor(private http: HttpClient) {}

  getSavingsGoals(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getSavingsGoal(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSavingsGoal(goal: Partial<SavingsGoal>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, goal);
  }

  updateSavingsGoal(id: string, goal: Partial<SavingsGoal>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, goal);
  }

  deleteSavingsGoal(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addProgress(id: string, amount: number, note?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/progress`, { amount, note });
  }

  completeSavingsGoal(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {});
  }

  getSavingsStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
