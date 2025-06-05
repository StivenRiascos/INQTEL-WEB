import type { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturasComponent } from './pages/facturas/facturas.component'; // NUEVO IMPORT
import { LoginComponent } from './pages/login/login.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

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
      { path: 'facturas', component: FacturasComponent }, // NUEVA RUTA
      { path: 'ajustes', component: AjustesComponent },
      { path: 'perfil', component: PerfilComponent },
      // Otras rutas protegidas
    ],
  },
];

// Exportar como default
export default adminRoutes;
