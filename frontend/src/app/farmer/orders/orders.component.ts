// farmer/orders/farmer-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-farmer-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./orders.component.html`
})
export class FarmerOrdersComponent implements OnInit {
  orders: any[] = [];
  showOrderModal = false;
  selectedOrder: any;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getFarmerOrders().subscribe({
      next: (response) => {
        this.orders = response.orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }
}