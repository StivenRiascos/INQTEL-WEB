import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PlansComponent } from './components/plans/plans.component';
import { ServicesComponent } from './components/servicios/servicios.component';
import { ReferralComponent } from './components/referral/referral.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'planes', component: PlansComponent },
  { path: 'servicios', component: ServicesComponent },
  { path: 'referidos', component: ReferralComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'contacto', component: ContactComponent },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.default),
  },

  { path: '**', redirectTo: '' },
];
