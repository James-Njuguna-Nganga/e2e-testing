// orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { TopbarComponent } from '../global/topbar/topbar.component';
import { FooterComponent } from '../global/footer/footer.component';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  produce: {
    title: string;
    imageUrl: string;
    unit: string;
  };
}

interface Order {
  id: string;
  totalPrice: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, TopbarComponent, FooterComponent],
  templateUrl: `./orders.component.html`
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  filteredOrders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (response: any) => {
        this.orders = response.orders;
        this.filteredOrders = this.orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filterOrders(event: any) {
    const status = event.target.value;
    if (status === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.status.toLowerCase() === status
      );
    }
  }

  parseInt(value: string): number {
    return parseInt(value);
  }
}