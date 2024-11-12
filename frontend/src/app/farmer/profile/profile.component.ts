import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TopbarComponent } from '../../buyers/global/topbar/topbar.component';
import { FooterComponent } from '../../buyers/global/footer/footer.component';
import { User } from '../../models/responses';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class FarmerProfileComponent implements OnInit {
  user: User | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  isSaving = false;
  isRequestingFarmerRole = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.isLoading = true;
      this.userService.getUserById(currentUser.id).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load profile';
          this.isLoading = false;
        }
      });
    }
  }

  async requestFarmerRole() {
    if (!this.user?.id) return;

    this.isRequestingFarmerRole = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.requestFarmerRole(this.user.id).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Farmer role request submitted successfully';
        this.isRequestingFarmerRole = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to submit farmer role request';
        this.isRequestingFarmerRole = false;
      }
    });
  }

  async saveProfile() {
    if (!this.user?.id) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber
    };

    this.userService.updateUser(this.user.id, updateData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Profile updated successfully';
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update profile';
        this.isSaving = false;
      }
    });
  }

  get canRequestFarmerRole(): boolean {
    return this.user?.role !== 'FARMER' && 
           this.user?.farmerRequestStatus !== 'PENDING';
  }

  get showPendingMessage(): boolean {
    return this.user?.farmerRequestStatus === 'PENDING';
  }
}
