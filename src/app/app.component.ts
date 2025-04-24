import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common'; // 👈 Importar NgIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf], // 👈 Añadir NgIf aquí
  template: `
    <ng-container *ngIf="!isAdminRoute; else adminContent">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </ng-container>

    <ng-template #adminContent>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'INQTEL - Internet por Fibra Óptica';
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute = this.router.url.includes('/admin');
      });
  }
}
