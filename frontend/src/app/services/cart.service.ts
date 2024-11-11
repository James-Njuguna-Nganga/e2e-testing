// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private productService: ProductService) {
    this.loadCart();
  }

  private loadCart() {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCart(productId: string) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
      this.saveCart(currentItems);
    } else {
      this.saveCart([...currentItems, { productId, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItemsSubject.value;
    this.saveCart(currentItems.filter(item => item.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart(currentItems);
    }
  }
  isProductInCart(productId: string): boolean {
    const currentItems = this.cartItemsSubject.value;
    return currentItems.some(item => item.productId === productId);
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.cartItemsSubject.next([]);
  }
}