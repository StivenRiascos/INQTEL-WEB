import type { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { LoginComponent } from './pages/login/login.component';

// Define the routes
const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];

// Export as default
export default adminRoutes;
