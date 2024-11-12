import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse, Product } from '../models/responses';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllProducts(skip = 0, take = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?skip=${skip}&take=${take}`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  

  searchProducts(query: string, farmer?: string, category?: string, skip = 0, take = 10): Observable<ProductResponse> {
    let url = `${this.apiUrl}/search?q=${query}&skip=${skip}&take=${take}`;
    if (farmer) url += `&farmer=${farmer}`;
    if (category) url += `&category=${category}`;
    return this.http.get<ProductResponse>(url);
  }

  getProductsByCategory(categoryId: string, skip = 0, take = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/category/${categoryId}?skip=${skip}&take=${take}`);
  }

  getFarmerProducts(skip = 0, take = 10): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.apiUrl}/farmer/products?skip=${skip}&take=${take}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      formData,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }) }
    );
  }

  updateProduct(id: string, data: FormData): Observable<Product> {
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    return this.http.put<Product>(
      `${this.apiUrl}/${id}`, 
      data,
      { headers }
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  updateProductStatus(id: string, status: string): Observable<Product> {
    return this.http.patch<Product>(
      `${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }
}