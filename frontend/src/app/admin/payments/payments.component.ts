// admin/payments/payments.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

interface PaymentFilter {
  status: string;
  startDate: string;
  endDate: string;
  search: string;
}

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Payments Overview</h2>
        
        <!-- Filters -->
        <div class="flex gap-4">
          <input type="text" 
                 [(ngModel)]="filters.search"
                 (input)="applyFilters()"
                 placeholder="Search payments..."
                 class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          
          <select [(ngModel)]="filters.status"
                  (change)="applyFilters()"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>

          <input type="date"
                 [(ngModel)]="filters.startDate"
                 (change)="applyFilters()"
                 class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          
          <input type="date"
                 [(ngModel)]="filters.endDate"
                 (change)="applyFilters()"
                 class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Payments</p>
              <p class="text-2xl font-bold text-gray-900">KES {{totalAmount}}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed Payments</p>
              <p class="text-2xl font-bold text-green-600">{{stats.completed}}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Payments</p>
              <p class="text-2xl font-bold text-yellow-600">{{stats.pending}}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-600">Failed Payments</p>
              <p class="text-2xl font-bold text-red-600">{{stats.failed}}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let payment of filteredPayments">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{payment.orderId}}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{payment.user.firstName}} {{payment.user.lastName}}</div>
                <div class="text-sm text-gray-500">{{payment.user.email}}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                KES {{payment.amount}}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': payment.status === 'PENDING',
                        'bg-green-100 text-green-800': payment.status === 'COMPLETED',
                        'bg-red-100 text-red-800': payment.status === 'FAILED'
                      }">
                  {{payment.status}}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{payment.paymentId}}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{payment.createdAt | date:'medium'}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminPaymentsComponent implements OnInit {
  payments: any[] = [];
  filteredPayments: any[] = [];
  totalAmount = 0;
  stats = {
    completed: 0,
    pending: 0,
    failed: 0
  };
  
  filters: PaymentFilter = {
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        this.payments = response.orders;
        this.calculateStats();
        this.applyFilters();
      },
      error: (error) => console.error('Error loading payments:', error)
    });
  }

  calculateStats() {
    this.stats = {
      completed: this.payments.filter(p => p.paymentStatus === 'COMPLETED').length,
      pending: this.payments.filter(p => p.paymentStatus === 'PENDING').length,
      failed: this.payments.filter(p => p.paymentStatus === 'FAILED').length
    };

    this.totalAmount = this.payments
      .filter(p => p.paymentStatus === 'COMPLETED')
      .reduce((sum, p) => sum + parseFloat(p.totalPrice), 0);
  }

  applyFilters() {
    let filtered = [...this.payments];

    if (this.filters.status) {
      filtered = filtered.filter(p => p.paymentStatus === this.filters.status);
    }

    if (this.filters.startDate && this.filters.endDate) {
      const start = new Date(this.filters.startDate);
      const end = new Date(this.filters.endDate);
      filtered = filtered.filter(p => {
        const date = new Date(p.createdAt);
        return date >= start && date <= end;
      });
    }

    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.orderId.toLowerCase().includes(search) ||
        p.paymentId.toLowerCase().includes(search) ||
        p.user.email.toLowerCase().includes(search)
      );
    }

    this.filteredPayments = filtered;
  }
}