import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { Order } from '../../models/responses';
@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Admin Dashboard</h2>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-sm font-medium text-gray-600">Total Revenue</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalRevenue | currency:'KES ' }}</p>
        </div>

        <!-- Total Orders -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-sm font-medium text-gray-600">Total Orders</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
        </div>

        <!-- Total Customers -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-sm font-medium text-gray-600">Total Customers</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalCustomers }}</p>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-sm font-medium text-gray-600">Total Products</p>
          <p class="text-2xl font-bold text-gray-900">{{ totalProducts }}</p>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of recentOrders">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.user.firstName }} {{ order.user.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ order.totalPrice | currency:'KES ' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                        'bg-green-100 text-green-800': order.status === 'COMPLETED',
                        'bg-red-100 text-red-800': order.status === 'CANCELLED'
                      }">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.createdAt | date:'medium' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Top Products Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">Top Selling Products</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let product of topProducts">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.unitsSold }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.revenue | currency:'KES ' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.farmerName }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminAnalyticsComponent implements OnInit {
  totalRevenue = 0;
  totalOrders = 0;
  totalCustomers = 0;
  totalProducts = 0;

  recentOrders: any[] = [];
  topProducts: any[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData() {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        const orders = response.orders;
        this.totalOrders = orders.length;
        this.totalRevenue = orders.reduce((sum:any, order: Order) => sum + parseFloat(order.totalPrice), 0);

        // Get unique customers
        const customerIds = new Set(orders.map((order: Order) => order.userId));
        this.totalCustomers = customerIds.size;

        // Get recent orders
        this.recentOrders = orders.slice(0, 5);

        this.loadTopProducts(orders);
      },
      error: (error) => console.error('Error fetching orders:', error)
    });

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.totalProducts = response.produce.length;
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  private loadTopProducts(orders: any[]) {
    const productSales = new Map<string, any>();

    orders.forEach(order => {
      order.orderItems.forEach((item: any) => {
        const productId = item.produceId;
        const existing = productSales.get(productId) || {
          title: item.produce.title,
          unitsSold: 0,
          revenue: 0,
          farmerName: `${item.produce.farmer.firstName} ${item.produce.farmer.lastName}`
        };

        existing.unitsSold += item.quantity;
        existing.revenue += parseFloat(item.price) * item.quantity;
        productSales.set(productId, existing);
      });
    });

    this.topProducts = Array.from(productSales.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }
}