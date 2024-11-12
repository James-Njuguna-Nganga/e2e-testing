// admin/orders/admin-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/responses';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Orders Management</h2>

        <!-- Status Filter -->
        <select [(ngModel)]="selectedStatus" 
                (change)="applyFilters()"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of filteredOrders">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.user.firstName }} {{ order.user.lastName }}</div>
                <div class="text-sm text-gray-500">{{ order.user.email }}</div>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button (click)="viewOrderDetails(order)"
                        class="text-blue-600 hover:text-blue-900 mr-4">
                  View
                </button>
                <button (click)="openStatusModal(order)"
                        class="text-green-600 hover:text-green-900">
                  Update Status
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div *ngIf="showOrderModal" 
           class="fixed z-50 inset-0 overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex items-center justify-center min-h-screen">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75" 
               aria-hidden="true"></div>

          <!-- Modal panel -->
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Order Details - {{ selectedOrder?.id }}
                  </h3>
                  <div class="mt-2" *ngIf="selectedOrder">
                    <!-- Order Info -->
                    <p class="text-sm text-gray-500">
                      Customer: {{ selectedOrder.user.firstName }} {{ selectedOrder.user.lastName }}<br>
                      Email: {{ selectedOrder.user.email }}<br>
                      Date: {{ selectedOrder.createdAt | date:'medium' }}<br>
                      Status: {{ selectedOrder.status }}
                    </p>
                    <!-- Order Items -->
                    <div class="mt-4">
                      <h4 class="font-medium text-gray-900">Items:</h4>
                      <ul class="divide-y divide-gray-200">
                        <li *ngFor="let item of selectedOrder?.orderItems || []" class="py-2">
                          <div class="flex justify-between">
                            <div>{{ item.produce.title }} ({{ item.quantity }} {{ item.produce.unit }})</div>
                            <div>{{ (+item.price * +item.quantity) | currency:'KES ' }}</div>
                          </div>
                        </li>
                      </ul>
                      <div class="flex justify-between mt-4 font-bold">
                        <div>Total:</div>
                        <div>{{ selectedOrder.totalPrice | currency:'KES ' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button type="button"
                      (click)="closeOrderModal()"
                      class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Status Modal -->
      <div *ngIf="showStatusModal" 
           class="fixed z-50 inset-0 overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex items-center justify-center min-h-screen">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75" 
               aria-hidden="true"></div>

          <!-- Modal panel -->
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:px-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Update Order Status - {{ selectedOrder?.id }}
                  </h3>
                  <div class="mt-2">
                    <label class="block text-sm font-medium text-gray-700">Select New Status</label>
                    <select [(ngModel)]="updatedStatus" 
                            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button type="button"
                      (click)="updateOrderStatus()"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm">
                Update
              </button>
              <button type="button"
                      (click)="closeStatusModal()"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus = '';
  
  showOrderModal = false;
  showStatusModal = false;
  selectedOrder: Order | null = null;
  updatedStatus = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.applyFilters();
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  applyFilters() {
    this.filteredOrders = this.selectedStatus ? 
      this.orders.filter(order => order.status === this.selectedStatus) : 
      this.orders;
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }

  openStatusModal(order: Order) {
    this.selectedOrder = order;
    this.updatedStatus = order.status;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus() {
    if (this.selectedOrder) {
      this.orderService.updateOrderStatus(this.selectedOrder.id, this.updatedStatus).subscribe({
        next: () => {
          this.loadOrders();
          this.closeStatusModal();
        },
        error: (error) => console.error('Error updating order status:', error)
      });
    }
  }
}