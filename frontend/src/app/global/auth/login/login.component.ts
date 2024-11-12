import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { TopbarComponent } from "../../../buyers/global/topbar/topbar.component";
import { FooterComponent } from "../../../buyers/global/footer/footer.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.loginForm.email?.trim() || !this.loginForm.password?.trim()) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    if (!this.isValidEmail(this.loginForm.email)) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        
        // Get user role and navigate accordingly
        const role = response.result.user.role;
        setTimeout(() => {
          if (role === 'FARMER') {
            this.router.navigate(['/farmer/dashboard']);
          } else if(role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          }
          else {
            this.router.navigate(['/home']);
          }
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Login failed';
        this.isLoading = false;
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}
