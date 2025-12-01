import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Badge {
  _id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'achievement' | 'streak' | 'special';
  earnedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  private apiUrl = `${environment.apiUrl}/badges`;

  constructor(private http: HttpClient) {}

  getBadges(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  checkAndAwardBadges(): Observable<any> {
    return this.http.post(`${this.apiUrl}/check`, {});
  }

  getLeaderboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboard`);
  }
}
