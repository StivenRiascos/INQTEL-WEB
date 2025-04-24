import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar class="sidebar-container"></app-sidebar>
      <div class="main-content">
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

      .sidebar-container {
        width: 250px;
        min-width: 250px;
        height: 100vh;
        background-color: white;
        border-right: 1px solid #e0e0e0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        position: fixed;
        left: 0;
        top: 0;
      }

      .main-content {
        flex: 1;
        margin-left: 250px; /* Match sidebar width */
        width: calc(100% - 250px);
        height: 100vh;
        overflow-y: auto;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class AdminComponent {
  constructor() {}
}
