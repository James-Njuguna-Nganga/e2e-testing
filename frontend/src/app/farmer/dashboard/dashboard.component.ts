import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/responses';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./dashboard.component.html`
})
export class FarmerDashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0
  };
  recentOrders: Order[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentOrders();
  }

  private loadStats() {
    // Load product stats
    this.productService.getFarmerProducts().subscribe(response => {
      this.stats.totalProducts = response.total;
      this.stats.activeProducts = response.produce.filter(p => p.status === 'AVAILABLE').length;
    });

    // Load order stats
    this.orderService.getFarmerOrders().subscribe(response => {
      this.stats.totalOrders = response.orders.length;
      this.stats.totalRevenue = response.orders
        .filter((order: Order) => order.status === 'COMPLETED')
        .reduce((sum:any, order: Order) => sum + parseFloat(order.totalPrice), 0);
    });
  }

  private loadRecentOrders() {
    this.orderService.getFarmerOrders().subscribe(response => {
      this.recentOrders = response.orders
        .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
    });
  }
}