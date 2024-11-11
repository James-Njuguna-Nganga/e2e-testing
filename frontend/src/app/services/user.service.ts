import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, data);
  }

  requestFarmerRole(userId: string): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}/request-farmer`, 
      { userId },
      { headers: this.getAuthHeaders() }
    );
  }

  getFarmerRequests(skip = 0, take = 10): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/farmer/requests?skip=${skip}&take=${take}`);
  }

  getAllFarmers(skip = 0, take = 10): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/farmer/all?skip=${skip}&take=${take}`);
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/u/stats`);
  }
}
