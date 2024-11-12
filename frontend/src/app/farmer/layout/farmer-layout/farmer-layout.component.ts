// farmer/layout/farmer-layout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-farmer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: `./farmer-layout.component.html`,
  styles: [`
    
  `]
})
export class FarmerLayoutComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  showUserMenu = false;
  user: any;
  clockInterval: any;
  currentYear = new Date().getFullYear();


  constructor(private authService: AuthService) {
    // Update time every second
    this.clockInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

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
    window.location.href = '/';
  }
}