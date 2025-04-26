import type { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { LoginComponent } from './pages/login/login.component';
// Importa otros componentes según sea necesario

// Define las rutas
const adminRoutes: Routes = [
  // Ruta de login - accesible sin autenticación
  { path: 'login', component: LoginComponent },

  // Rutas protegidas - requieren autenticación
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
      // Otras rutas protegidas
    ],
  },
];

// Exportar como default
export default adminRoutes;
