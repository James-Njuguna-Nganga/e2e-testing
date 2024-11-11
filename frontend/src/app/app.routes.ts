import { Routes } from '@angular/router';
import { HomeComponent } from './buyers/home/home.component';
import { LoginComponent } from './global/auth/login/login.component';
import { RegisterComponent } from './global/auth/register/register.component';
import { ForgotPasswordComponent } from './global/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './global/auth/reset-password/reset-password.component';
import { ProfileComponent } from './global/auth/profile/profile.component';
import { AboutComponent } from './buyers/about/about.component';

export const routes: Routes = [
    //BUYER
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'login', component: LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component:ResetPasswordComponent},
    {path: 'profile', component:ProfileComponent},
    {path: 'about', component:AboutComponent}


];
