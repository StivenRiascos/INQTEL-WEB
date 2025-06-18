import type { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlansComponent } from './components/plans/plans.component';
import { ServicesComponent } from './components/servicios/servicios.component';
import { NosotrosComponent } from './components/nosotros/nosotrosl.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ContactComponent } from './components/contact/contact.component';
import { PasarelaComponent } from './components/pasarela/pasarela.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  // Rutas públicas con header y footer
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'planes', component: PlansComponent },
      { path: 'servicios', component: ServicesComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'pagos', component: PagosComponent },
      { path: 'contacto', component: ContactComponent },
      { path: 'pasarela', component: PasarelaComponent }, // 👈 Ruta agregada
    ],
  },

  // Ruta de administración
  {
    path: 'admin',
    component: AdminComponent,
    loadChildren: () => import('./admin/admin.routes').then((m) => m.default),
  },

  // Redirección en caso de rutas no encontradas
  { path: '**', redirectTo: '' },
];
