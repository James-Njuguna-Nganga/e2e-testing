// admin/dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Order } from '../../models/responses';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./dashboard.component.html`
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    newUsers: 0,
    farmers: 0,
    buyers: 0,
    totalRevenue: 0,
    completedOrders: 0,
    totalProducts: 0,
    outOfStock: 0,
    pendingRequests: 0
  };
  
  recentOrders: any[] = [];
  farmerRequests: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentOrders();
    this.loadFarmerRequests();
  }

  loadStats() {
    // Load user stats
    this.userService.getUserStats().subscribe(stats => {
      this.stats.totalUsers = stats.total;
      this.stats.farmers = stats.byRole['FARMER'] || 0;
      this.stats.buyers = stats.byRole['BUYER'] || 0;
      // Calculate new users in the last week
      this.stats.newUsers = stats.newUsersThisWeek || 0;
    });

    // Load order stats
    this.orderService.getAllOrders().subscribe(response => {
      const completedOrders = response.orders.filter((o: Order) => o.status === 'COMPLETED');
      this.stats.completedOrders = completedOrders.length;
      this.stats.totalRevenue = completedOrders.reduce((sum: number, order: Order) => 
        sum + parseFloat(order.totalPrice), 0);
    });

    // Load product stats
    this.productService.getAllProducts().subscribe(response => {
      this.stats.totalProducts = response.produce.length;
      this.stats.outOfStock = response.produce.filter(p => p.status === 'OUT_OF_STOCK').length;
    });

    // Load pending requests
    this.userService.getFarmerRequests().subscribe(response => {
      this.stats.pendingRequests = response.length;
    });
  }
  loadRecentOrders() {
    this.orderService.getAllOrders().subscribe(response => {
      this.recentOrders = response.orders.slice(-5).reverse();
    });
  }

  loadFarmerRequests() {
    this.userService.getFarmerRequests().subscribe(response => {
      this.farmerRequests = response.slice(-5).reverse();
    });
  }
  approveRequest(requestId: string) {
    this.userService.approveFarmerRequest(requestId).subscribe(response => {
      // Handle success
    });
  }
  rejectRequest(requestId: string) {
    this.userService.rejectFarmerRequest(requestId).subscribe(response => {
      // Handle success
    });
  }
}

