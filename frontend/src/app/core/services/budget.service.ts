import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget, BudgetProgress } from '../../shared/models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  //private readonly API_URL = 'http://localhost:3000/api/budgets';
  private readonly API_URL = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getBudgets(month?: number, year?: number): Observable<{ success: boolean; data: Budget[] }> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<{ success: boolean; data: Budget[] }>(this.API_URL, { params });
  }

  createBudget(budget: Budget): Observable<{ success: boolean; data: Budget }> {
    return this.http.post<{ success: boolean; data: Budget }>(this.API_URL, budget);
  }

  updateBudget(
    id: string,
    budget: Partial<Budget>
  ): Observable<{ success: boolean; data: Budget }> {
    return this.http.put<{ success: boolean; data: Budget }>(`${this.API_URL}/${id}`, budget);
  }

  deleteBudget(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

  getBudgetProgress(
    month: number,
    year: number
  ): Observable<{ success: boolean; data: BudgetProgress[] }> {
    const params = new HttpParams().set('month', month.toString()).set('year', year.toString());

    return this.http.get<{ success: boolean; data: BudgetProgress[] }>(`${this.API_URL}/progress`, {
      params,
    });
  }
}
