import type { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlansComponent } from './components/plans/plans.component';
import { ServicesComponent } from './components/servicios/servicios.component';
import { NosotrosComponent } from './components/nosotros/nosotrosl.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  // Public routes with header and footer
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'planes', component: PlansComponent },
      { path: 'servicios', component: ServicesComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'pagos', component: PagosComponent },
      { path: 'contacto', component: ContactComponent },
    ],
  },

  // Admin routes with its own layout
  {
    path: 'admin',
    component: AdminComponent, // This will be the layout component for admin
    loadChildren: () => import('./admin/admin.routes').then((m) => m.default),
  },

  { path: '**', redirectTo: '' },
];
