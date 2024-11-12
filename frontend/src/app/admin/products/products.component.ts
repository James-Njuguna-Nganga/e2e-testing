// admin/products/admin-products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Product, Category, User } from '../../models/responses';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./products.component.html`
  
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  farmers: User[] = [];
  selectedCategory = '';
  selectedFarmer = '';
  searchQuery = '';
  stats = {
    total: 0,
    available: 0,
    outOfStock: 0
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadFarmers();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.produce;
        this.calculateStats();
        this.applyFilters();
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadFarmers() {
    this.userService.getAllFarmers().subscribe({
      next: (response) => {
        this.farmers = response;
      },
      error: (error) => console.error('Error loading farmers:', error)
    });
  }

  calculateStats() {
    this.stats = {
      total: this.products.length,
      available: this.products.filter(p => p.status === 'AVAILABLE').length,
      outOfStock: this.products.filter(p => p.status === 'OUT_OF_STOCK').length
    };
  }

  applyFilters() {
    let filtered = [...this.products];

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === this.selectedCategory);
    }

    if (this.selectedFarmer) {
      filtered = filtered.filter(p => p.farmerId === this.selectedFarmer);
    }

    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search)
      );
    }

    this.filteredProducts = filtered;
  }
}