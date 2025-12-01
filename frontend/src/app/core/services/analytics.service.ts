import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSpendingTrends(timeframe: string = 'monthly', months: number = 6): Observable<any> {
    const params = new HttpParams().set('timeframe', timeframe).set('months', months.toString());
    return this.http.get(`${this.apiUrl}/spending-trends`, { params });
  }

  getCategoryInsights(month?: number, year?: number): Observable<any> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get(`${this.apiUrl}/category-insights`, { params });
  }

  getPredictions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions`);
  }

  getTimeframeAnalysis(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/timeframe`, { params });
  }

  getOverspendingAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }
}
