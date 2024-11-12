import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/responses';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./users.component.html`
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.filterByRole();
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  filterByRole() {
    this.filteredUsers = this.selectedRole ? 
      this.users.filter(user => user.role === this.selectedRole) : 
      this.users;
  }

  approveFarmerRequest(userId: string) {
    this.userService.approveFarmerRequest(userId).subscribe({
      next: () => this.loadUsers(),
      error: (error) => console.error('Error approving request:', error)
    });
  }

  rejectFarmerRequest(userId: string) {
    this.userService.rejectFarmerRequest(userId).subscribe({
      next: () => this.loadUsers(),
      error: (error) => console.error('Error rejecting request:', error)
    });
  }
}
