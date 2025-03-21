import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Goal } from '../Models/Goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = 'https://localhost:7065/api/goals';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  getGoals(): Observable<Goal[]> {
    console.log('Authorization', this.authService.getToken());
    return this.http.get<Goal[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getGoalById(id: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal, { headers: this.getHeaders() });
  }

  updateGoal(goal: Goal): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${goal.id}`, goal, { headers: this.getHeaders() });
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
