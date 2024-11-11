import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TopbarComponent } from "../../../buyers/global/topbar/topbar.component";
import { FooterComponent } from "../../../buyers/global/footer/footer.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Validate all fields
    if (!this.registerForm.email?.trim() || 
        !this.registerForm.password?.trim() ||
        !this.registerForm.firstName?.trim() ||
        !this.registerForm.lastName?.trim() ||
        !this.registerForm.phoneNumber?.trim()) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (!this.isValidEmail(this.registerForm.email)) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    if (this.registerForm.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    if (!this.isValidPhoneNumber(this.registerForm.phoneNumber)) {
      this.errorMessage = 'Please enter a valid phone number (+254...)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }

  private isValidPhoneNumber(phone: string): boolean {
    return /^\+254\d{9}$/.test(phone);
  }
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
