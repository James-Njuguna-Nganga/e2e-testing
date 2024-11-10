import { Routes } from '@angular/router';
import { HomeComponent } from './buyers/home/home.component';

export const routes: Routes = [
    //BUYER
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },


];
