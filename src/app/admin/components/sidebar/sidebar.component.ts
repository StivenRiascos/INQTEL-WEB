import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="assets/logo.png" alt="Logo" height="32" class="me-2" />
        <span class="logo-text">INQTEL</span>
      </div>

      <div class="sidebar-section">
        <p class="section-title">Dashboard</p>
        <a
          class="sidebar-link"
          routerLink="/admin/dashboard"
          routerLinkActive="active"
        >
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        <a
          class="sidebar-link"
          routerLink="/admin/clientes"
          routerLinkActive="active"
        >
          <i class="fas fa-users"></i>
          <span>Clientes</span>
        </a>
      </div>

      <div class="sidebar-section">
        <p class="section-title">Otras opciones</p>
        <a
          class="sidebar-link"
          routerLink="/admin/ajustes"
          routerLinkActive="active"
        >
          <i class="fas fa-cog"></i>
          <span>Ajustes</span>
        </a>
      </div>
    </div>
  `,
  styles: [
    `
      .sidebar {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem;
        overflow-y: auto;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }

      .logo-text {
        font-size: 1.25rem;
        font-weight: bold;
      }

      .sidebar-section {
        margin-bottom: 1.5rem;
      }

      .section-title {
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: bold;
        color: #6c757d;
        margin-bottom: 0.5rem;
      }

      .sidebar-link {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        color: #333;
        text-decoration: none;
        border-radius: 0.375rem;
        margin-bottom: 0.25rem;
      }

      .sidebar-link i {
        margin-right: 0.75rem;
        font-size: 1.1rem;
      }

      .sidebar-link:hover {
        background-color: #f0f0f0;
        color: #3f51b5;
      }

      .sidebar-link.active {
        background-color: #3f51b5;
        color: white;
      }

      .sidebar-link.active i {
        color: white;
      }
    `,
  ],
})
export class SidebarComponent {
  constructor() {}
}
