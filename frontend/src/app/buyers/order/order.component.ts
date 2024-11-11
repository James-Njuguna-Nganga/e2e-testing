// order.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { TopbarComponent } from "../global/topbar/topbar.component";
import { FooterComponent } from "../global/footer/footer.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: `./order.component.html`
})
export class OrderComponent implements OnInit {
  orderItems: any[] = [];
  phoneNumber: string = '';
  totalAmount: number = 0;
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.phoneNumber = user?.phoneNumber || '';

    // Handle direct order
    const productId = this.route.snapshot.queryParams['productId'];
    const quantity = this.route.snapshot.queryParams['quantity'];
    
    if (productId) {
      this.productService.getProductById(productId).subscribe(product => {
        this.orderItems = [{
          produce: product,
          quantity: parseInt(quantity || '1') // Ensure integer
        }];
        this.updateTotal();
      });
    } else {
      // Handle cart checkout
      this.loadCartItems();
    }
  }

private loadCartItems() {
  this.cartService.cartItems$.subscribe(cartItems => {
    if (cartItems.length) {
      Promise.all(
        cartItems.map(item => 
          this.productService.getProductById(item.productId)
            .toPromise()
            .then(product => ({
              produce: product,
              quantity: item.quantity
            }))
        )
      ).then(items => {
        this.orderItems = items;
        this.updateTotal();
      });
    }
  });
}

  updateTotal() {
    this.totalAmount = this.orderItems.reduce((total, item) => 
      total + (item.produce.price * item.quantity), 0);
  }

  placeOrder() {
    if (!this.phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    this.isProcessing = true;
    const orderData = {
      items: this.orderItems.map(item => ({
        produceId: item.produce.id,
        quantity: parseInt(item.quantity.toString()) // Ensure integer
      })),
      phoneNumber: this.phoneNumber
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.cartService.clearCart(); // Clear cart if checkout was from cart
        this.router.navigate(['/orders']); // Redirect to orders page
      },
      error: (error) => {
        alert(error.error.message || 'Failed to place order');
        this.isProcessing = false;
      }
    });
  }
}