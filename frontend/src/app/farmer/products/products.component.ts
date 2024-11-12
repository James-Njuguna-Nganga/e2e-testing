// farmer/products/farmer-products.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-farmer-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: `./products.component.html`
})
export class FarmerProductsComponent implements OnInit {
  @ViewChild('imageInput')
  imageInput!: ElementRef;
  products: any[] = [];
  categories: any[] = [];
  showModal = false;
  editingProduct = false;
  productForm: any = {};
  isSaving = false;
  confirmationModal = {
    show: false,
    title: '',
    message: '',
    action: () => {}
  };
  imagePreview: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getFarmerProducts().subscribe({
      next: (response) => {
        this.products = response.produce;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
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

  openProductModal() {
    this.editingProduct = false;
    this.productForm = {};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    const formData = new FormData();
    
    // Validate required fields
    if (!this.productForm.title || !this.productForm.description || 
        !this.productForm.price || !this.productForm.quantity || 
        !this.productForm.unit || !this.productForm.categoryId) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Add form fields to FormData with proper validation
    formData.append('title', this.productForm.title);
    formData.append('description', this.productForm.description);
    formData.append('price', this.productForm.price.toString());
    formData.append('quantity', this.productForm.quantity.toString());
    formData.append('unit', this.productForm.unit);
    formData.append('categoryId', this.productForm.categoryId);
    
    // Handle date properly
    const date = new Date();
    formData.append('date', date.toISOString());
    
    formData.append('location', this.productForm.location || 'Kenya');

    // Handle image file
    if (this.productForm.image) {
      formData.append('image', this.productForm.image);
    }

    this.isSaving = true;

    if (this.editingProduct) {
      this.productService.updateProduct(this.productForm.id, formData).subscribe({
        next: () => {
          this.handleSuccess('Product updated successfully');
        },
        error: (error) => {
          this.handleError('Error updating product', error);
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.handleSuccess('Product created successfully');
        },
        error: (error) => {
          this.handleError('Error creating product', error);
        }
      });
    }
  }

  editProduct(product: any) {
    this.editingProduct = true;
    this.productForm = { ...product };
    this.showModal = true;
  }

  deleteProduct(productId: string) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    
  }

  openDeleteConfirmation(productId: string) {
    this.confirmationModal = {
      show: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      action: () => this.deleteProduct(productId)
    };
  }

  showDeleteConfirmation(productId: string) {
    this.confirmationModal = {
      show: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This action cannot be undone.',
      action: () => {
        this.deleteProduct(productId);
        this.confirmationModal.show = false;
      }
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showError('Please select an image file');
        return;
      }

      this.productForm.image = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private handleSuccess(message: string) {
    this.loadProducts();
    this.closeModal();
    this.isSaving = false;
    this.showSuccessMessage(message);
  }

  private handleError(message: string, error: any) {
    console.error(message, error);
    this.isSaving = false;
    this.showError(message);
  }

  private showError(message: string) {
    this.confirmationModal = {
      show: true,
      title: 'Error',
      message: message,
      action: () => {
        this.confirmationModal.show = false;
      }
    };
  }

  private showSuccessMessage(message: string) {
    this.confirmationModal = {
      show: true,
      title: 'Success',
      message: message,
      action: () => {
        this.confirmationModal.show = false;
      }
    };
  }

  clearForm() {
    this.productForm = {};
    this.imagePreview = null;
  }
}