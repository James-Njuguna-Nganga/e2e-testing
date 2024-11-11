// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { TopbarComponent } from '../global/topbar/topbar.component';
import { FooterComponent } from '../global/footer/footer.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TopbarComponent, FooterComponent],
  templateUrl: `./cart.component.html`,
  styleUrl: `./cart.component.css`
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      Promise.all(
        items.map(item => 
          this.productService.getProductById(item.productId)
            .toPromise()
            .then(product => ({ product, quantity: item.quantity }))
        )
      ).then(cartItems => {
        this.cartItems = cartItems;
        this.calculateTotal();
      });
    });
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => 
      total + (parseFloat(item.product.price) * item.quantity), 0);
  }

  checkout() {
    // Will implement in next phase
    console.log('Proceeding to checkout...');
  }
}