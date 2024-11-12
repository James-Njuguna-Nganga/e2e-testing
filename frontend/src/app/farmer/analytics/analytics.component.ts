// analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/responses';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Analytics Overview</h2>

      <!-- Analytics Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Revenue Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <h3 class="text-2xl font-bold text-gray-900">KES {{totalRevenue}}</h3>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-green-600 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
              {{revenueGrowth}}%
            </span>
            <span class="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <!-- Total Orders Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <h3 class="text-2xl font-bold text-gray-900">{{totalOrders}}</h3>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-blue-600">{{completedOrders}} completed</span>
            <span class="text-gray-500 ml-2">{{pendingOrders}} pending</span>
          </div>
        </div>

        <!-- Top Product Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-600">Best Selling Product</p>
              <h3 class="text-xl font-bold text-gray-900">{{topProduct?.title || 'N/A'}}</h3>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
          </div>
          <div class="text-sm">
            <p class="text-gray-500">Units sold: <span class="font-medium">{{topProduct?.unitsSold || 0}}</span></p>
            <p class="text-gray-500">Revenue: <span class="font-medium">KES {{topProduct?.revenue || 0}}</span></p>
          </div>
        </div>

        <!-- Average Order Value -->
        <div class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-medium text-gray-600">Average Order Value</p>
              <h3 class="text-2xl font-bold text-gray-900">KES {{averageOrderValue}}</h3>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FarmerAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  totalOrders = 0;
  completedOrders = 0;
  pendingOrders = 0;
  revenueGrowth = 0;
  averageOrderValue = 0;
  topProduct: any = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  private loadAnalytics() {
    this.orderService.getFarmerOrders().subscribe(response => {
      const orders = response.orders;
      
      // Calculate total revenue and orders
      this.totalOrders = orders.length;
      this.completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED').length;
      this.pendingOrders = orders.filter((o: Order) => o.status === 'PENDING').length;
      
      const completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED');
      this.totalRevenue = completedOrders.reduce((sum: any, order: Order) => 
        sum + parseFloat(order.totalPrice), 0);
      
      // Calculate average order value
      this.averageOrderValue = this.totalRevenue / (completedOrders.length || 1);
      
      // Find top product
      const productSales = new Map();
      orders.forEach((order: Order) => {
        order.orderItems.forEach(item => {
          const existing = productSales.get(item.produceId) || {
            title: item.produce.title,
            unitsSold: 0,
            revenue: 0
          };
          existing.unitsSold += item.quantity;
          existing.revenue += parseFloat(item.price) * item.quantity;
          productSales.set(item.produceId, existing);
        });
      });
      
      this.topProduct = Array.from(productSales.values())
        .sort((a, b) => b.unitsSold - a.unitsSold)[0];
    });
  }
}