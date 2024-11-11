// forgot-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TopbarComponent } from "../../../buyers/global/topbar/topbar.component";
import { FooterComponent } from "../../../buyers/global/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showResetCodeForm = false;
  resetForm = {
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Validate email
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Email is required';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        this.successMessage = 'Reset code sent to your email';
        this.showResetCodeForm = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to request password reset';
        this.isLoading = false;
      }
    });
  }

  onResetSubmit() {
    // Validate inputs
    if (!this.resetForm.resetCode || !this.resetForm.resetCode.trim()) {
      this.errorMessage = 'Reset code is required';
      return;
    }

    if (!this.resetForm.newPassword || !this.resetForm.newPassword.trim()) {
      this.errorMessage = 'New password is required';
      return;
    }

    if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.resetForm.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword({
      resetToken: this.resetForm.resetCode,
      newPassword: this.resetForm.newPassword
    }).subscribe({
      next: () => {
        this.router.navigate(['/login'], { 
          queryParams: { message: 'Password reset successful' }
        });
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to reset password';
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}