import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse, Product } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) { }

  getAllProducts(skip = 0, take = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?skip=${skip}&take=${take}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string, farmer?: string, category?: string): Observable<ProductResponse> {
    let url = `${this.apiUrl}/search?q=${query}`;
    if (farmer) url += `&farmer=${farmer}`;
    if (category) url += `&category=${category}`;
    return this.http.get<ProductResponse>(url);
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${categoryId}`);
  }
}