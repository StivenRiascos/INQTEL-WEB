import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarService } from './components/sidebar/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="admin-layout">
      <!-- Sidebar - solo se muestra si NO estamos en la página de login -->
      <app-sidebar *ngIf="!isLoginPage"></app-sidebar>

      <!-- Main Content - ajusta el margen según si el sidebar está visible -->
      <div
        class="main-content"
        [ngClass]="{
          'with-sidebar': !isLoginPage && sidebarService.isExpanded,
          'without-sidebar': !isLoginPage && !sidebarService.isExpanded
        }"
      >
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: flex;
        height: 100vh;
        width: 100%;
        overflow: hidden;
      }

      .main-content {
        flex: 1;
        height: 100vh;
        overflow-y: auto;
        background-color: #f8f9fa;
        transition: margin-left 0.3s ease;
        width: 100%;
      }

      .main-content.with-sidebar {
        @media (min-width: 768px) {
          margin-left: 250px; /* Match sidebar width */
          width: calc(100% - 250px);
        }
      }

      .main-content.without-sidebar {
        margin-left: 0;
        width: 100%;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  isLoginPage = false;

  constructor(private router: Router, public sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.checkIfLoginPage(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkIfLoginPage(event.url);
      });
  }

  private checkIfLoginPage(url: string): void {
    this.isLoginPage = url.includes('/admin/login');
  }
}
