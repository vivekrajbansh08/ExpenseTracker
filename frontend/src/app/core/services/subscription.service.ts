import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Subscription {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  billingCycle: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  startDate: Date;
  nextBillingDate: Date;
  description?: string;
  isActive: boolean;
  cancelledAt?: Date;
  reminderDays: number;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getSubscriptions(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getSubscription(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createSubscription(subscription: Partial<Subscription>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, subscription);
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, subscription);
  }

  cancelSubscription(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUpcomingBills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming`);
  }

  getSubscriptionStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
