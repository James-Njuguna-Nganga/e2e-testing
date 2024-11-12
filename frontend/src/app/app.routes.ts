import { Routes } from '@angular/router';
import { HomeComponent } from './buyers/home/home.component';
import { LoginComponent } from './global/auth/login/login.component';
import { RegisterComponent } from './global/auth/register/register.component';
import { ForgotPasswordComponent } from './global/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './global/auth/reset-password/reset-password.component';
import { ProfileComponent } from './global/auth/profile/profile.component';
import { AboutComponent } from './buyers/about/about.component';
import { CartComponent } from './buyers/cart/cart.component';
import { ProductComponent } from './buyers/product/product.component';
import { OrderComponent } from './buyers/order/order.component';
import { ProductsComponent } from './buyers/products/products.component';
import { OrdersComponent } from './buyers/orders/orders.component';
import { FarmerLayoutComponent } from './farmer/layout/farmer-layout/farmer-layout.component';
import {FarmerGuard} from './guards/farmer.guard';
import { FarmerDashboardComponent } from './farmer/dashboard/dashboard.component';
import { FarmerProductsComponent } from './farmer/products/products.component';
import { FarmerOrdersComponent } from './farmer/orders/orders.component';
import { FarmerAnalyticsComponent } from './farmer/analytics/analytics.component';
import { FarmerProfileComponent } from './farmer/profile/profile.component';
import { AdminLayoutComponent } from './admin/layout/layout.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './admin/products/products.component';
import { AdminUsersComponent } from './admin/users/users.component';
import { AdminPaymentsComponent } from './admin/payments/payments.component';

export const routes: Routes = [
    //BUYER
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'login', component: LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component:ResetPasswordComponent},
    {path: 'profile', component:ProfileComponent},
    {path: 'about', component:AboutComponent},
    {path: 'cart', component:CartComponent},
    {path: 'product/:id', component: ProductComponent},
    {path: 'order', component: OrderComponent},
    {path: 'products', component:ProductsComponent},
    {path: 'orders', component:OrdersComponent},

    //FARMER
    {
        path: 'farmer',
        component: FarmerLayoutComponent,
        canActivate: [FarmerGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: FarmerDashboardComponent },
          { path: 'products', component: FarmerProductsComponent },
          { path: 'orders', component: FarmerOrdersComponent },
          { path: 'analytics', component: FarmerAnalyticsComponent },
          { path: 'profile', component: FarmerProfileComponent }
        ]
      },

      //ADMIN
      {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'products', component: AdminProductsComponent },
          { path: 'orders', component: OrdersComponent },
          { path: 'users', component: AdminUsersComponent },
          { path: 'payments', component: AdminPaymentsComponent },
          { path: 'analytics', component: FarmerAnalyticsComponent },
        ]
      },

      { path: '**', redirectTo: 'home' }


];
