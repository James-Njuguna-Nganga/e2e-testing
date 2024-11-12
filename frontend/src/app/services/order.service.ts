// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderItem {
  produceId: string;
  quantity: number;
}

interface CreateOrderRequest {
  items: OrderItem[];
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/order';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(orderData: CreateOrderRequest): Observable<any> {
    return this.http.post(this.apiUrl, orderData, { headers: this.getAuthHeaders() });
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-orders`, { headers: this.getAuthHeaders() });
  }
  getFarmerOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmer-orders`, { headers: this.getAuthHeaders() });
  }
  getOrderDetails(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`, { headers: this.getAuthHeaders() });
  }
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const url = `${this.apiUrl}/${orderId}`;
    const body = { status };
    return this.http.put(url, body, { headers: this.getAuthHeaders() });
  }
}