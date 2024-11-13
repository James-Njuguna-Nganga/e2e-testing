import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse, Category } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/all`);
  }

  createCategory(name: string): Observable<Category> {
    
    return this.http.post<Category>(`${this.apiUrl}/create`, { name }, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: string, name: string): Observable<Category> {
   
    return this.http.put<Category>(`${this.apiUrl}/${id}`, { name }, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: string): Observable<void> {
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}