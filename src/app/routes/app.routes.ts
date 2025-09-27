import { Routes } from '@angular/router';
import { SerieListComponent } from '../pages/series/serie-list/serie-list.component';
import { authGuard } from '../core/guards/auth.guard';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/auth/login/login.component';
import { RegisterComponent } from '../pages/auth/register/register.component';
import {ProfileComponent} from '../pages/profile/profile.component';
import {AdminStatsComponent} from '../pages/admin/admin-stats/admin-stats.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'series/liste', component: SerieListComponent },       // ✅ public
  { path: 'login', component: LoginComponent },                  // ✅ public
  { path: 'register', component: RegisterComponent },            // ✅ public

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // 🔒 protégé
  { path: 'admin/stats', component: AdminStatsComponent, canActivate: [authGuard] }, // 🔒 protégé

  { path: '**', redirectTo: '' } // fallback
];
