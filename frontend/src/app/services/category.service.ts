import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/category';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/all`);
  }
}
