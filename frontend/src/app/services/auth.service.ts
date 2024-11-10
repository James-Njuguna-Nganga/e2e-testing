// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  message: string;
  result: {
    user: any;
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'authToken';
  private userKey = 'user';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.result.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.result.user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.decodeToken(token);
    return payload?.role || null;
  }

  isBuyer(): boolean {
    return this.getRole() === 'BUYER';
  }

  isFarmer(): boolean {
    return this.getRole() === 'FARMER';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.decodeToken(token);
    return payload?.userId || null;
  }

  changePassword(changePasswordRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordRequest, {
      headers: this.getAuthHeaders()
    });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
  }

  resetPassword(resetPasswordRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordRequest);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}