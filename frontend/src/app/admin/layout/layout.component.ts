// admin/layout/admin-layout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./layout.component.html`,
  styleUrl: `./layout.component.css`
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  showUserMenu = false;
  clockInterval: any;
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService) {
    this.clockInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
  }
}