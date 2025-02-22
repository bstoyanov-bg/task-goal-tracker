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
          'Authorization': `Bearer ${this.authService.getToken()}`
      });
  }

  getGoals(): Observable<Goal[]> {
      return this.http.get<Goal[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}

// Add more methods (e.g., createGoal) for full CRUD.