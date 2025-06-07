// src/app/admin/admin.routes.ts
import type { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard'; // Importamos el nuevo guardián

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { LoginComponent } from './pages/login/login.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MyInvoicesComponent } from './pages/my-invoices/my-invoices.component';
import { MyPlanComponent } from './pages/my-plan/my-plan.component';

// Define las rutas
const adminRoutes: Routes = [
  // Ruta de login - accesible sin autenticación
  { path: 'login', component: LoginComponent },

  // Rutas protegidas que requieren que el usuario esté logueado
  {
    path: '',
    canActivate: [AuthGuard], // Este guardián verifica si hay una sesión activa
    children: [
      // Rutas que además de estar logueado, requieren el rol de 'admin'
      {
        path: '',
        canActivate: [AdminGuard], // Este guardián verifica si el rol es 'admin'
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'clientes', component: ClientesComponent },
          { path: 'facturas', component: FacturasComponent },
          { path: 'ajustes', component: AjustesComponent },
        ],
      },
      // Ruta de perfil, accesible para cualquier usuario logueado
      { path: 'perfil', component: PerfilComponent },
      { path: 'mis-facturas', component: MyInvoicesComponent }, // Nueva ruta
      { path: 'mi-plan', component: MyPlanComponent },
    ],
  },
];

// Exportar como default
export default adminRoutes;
