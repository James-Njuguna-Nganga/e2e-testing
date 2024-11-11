// product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { TopbarComponent } from '../global/topbar/topbar.component';
import { FooterComponent } from '../global/footer/footer.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, TopbarComponent, FooterComponent],
  templateUrl: `./product.component.html`
})
export class ProductComponent implements OnInit {
  product: any = null;
  isInCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(product => {
        this.product = product;
        this.isInCart = this.cartService.isProductInCart(id);
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  addToCart() {
    // if (!this.authService.isLoggedIn()) {
    //   this.router.navigate(['/login']);
    //   return;
    // }

    this.cartService.addToCart(this.product.id);
    this.isInCart = true;
  }

  orderNow() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    // Implement order functionality
  }
}