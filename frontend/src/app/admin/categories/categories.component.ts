// categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/responses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  editCategoryId: string | null = null;
  editCategoryName: string = '';

  // Delete Modal
  showDeleteModal: boolean = false;
  categoryToDelete: Category | null = null;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.categories;
        console.log('Fetched Categories:', this.categories);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  createCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.createCategory(this.newCategoryName).subscribe({
        next: (createdCategory) => {
          this.newCategoryName = '';
          this.categories.push(createdCategory);
          console.log('Category Created:', createdCategory);
        },
        error: (err) => console.error('Error creating category', err)
      });
    }
  }

  startEdit(category: Category): void {
    this.editCategoryId = category.id;
    this.editCategoryName = category.name;
  }

  updateCategory(): void {
    if (this.editCategoryId && this.editCategoryName.trim()) {
      this.categoryService.updateCategory(this.editCategoryId, this.editCategoryName).subscribe({
        next: (updatedCategory) => {
          const index = this.categories.findIndex(cat => cat.id === this.editCategoryId);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.editCategoryId = null;
          this.editCategoryName = '';
          console.log('Category Updated:', updatedCategory);
        },
        error: (err) => console.error('Error updating category', err)
      });
    }
  }

  // Delete Modal Methods
  openDeleteModal(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.categoryToDelete = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(cat => cat.id !== this.categoryToDelete!.id);
          console.log(`Category with ID ${this.categoryToDelete?.id} deleted.`);
          this.closeDeleteModal();
        },
        error: (err) => console.error('Error deleting category', err)
      });
    }
  }

  cancelEdit(): void {
    this.editCategoryId = null;
    this.editCategoryName = '';
  }
}