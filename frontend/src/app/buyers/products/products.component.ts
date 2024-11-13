// products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule , Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { TopbarComponent } from '../global/topbar/topbar.component';
import { FooterComponent } from '../global/footer/footer.component';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: `./products.component.html`
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  farmers: any[] = [];
  selectedCategory = '';
  selectedFarmer = '';
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadFarmers();
  }

  loadProducts() {
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    this.productService.searchProducts(
      this.searchQuery,
      this.selectedFarmer,
      this.selectedCategory,
     
    ).subscribe(response => {
      this.products = response.produce;
      this.totalItems = response.total;
    });
  }

  // Reuse methods from HomeComponent
  addToCart(product: any, event: Event) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product.id);
  }

  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadFarmers() {
    this.userService.getAllFarmers().subscribe(
      (data: any) => {
        this.farmers = data;
      },
      error => console.error('Error loading farmers:', error)
    );
  }
  orderNow(product: any, event: Event) {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/order'], {
      queryParams: {
        productId: product.id,
        quantity: 1
      }
    });
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.isProductInCart(productId);
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}