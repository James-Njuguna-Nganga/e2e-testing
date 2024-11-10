import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) { }

  getAllProducts(skip = 0, take = 10) {
    return this.http.get(`${this.apiUrl}?skip=${skip}&take=${take}`);
  }

  getProductById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string) {
    return this.http.get(`${this.apiUrl}/search?q=${query}`);
  }

  getProductsByCategory(categoryId: string) {
    return this.http.get(`${this.apiUrl}/category/${categoryId}`);
  }
}