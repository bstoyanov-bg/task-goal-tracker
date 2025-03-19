import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7065/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    // Optionally redirect to login
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // Adjust based on your token's claim (e.g., 'email' or 'sub')
  }
}

// Might add token expiration checks.