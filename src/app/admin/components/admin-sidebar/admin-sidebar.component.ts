import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
})
export class AdminSidebarComponent {
  @Input() collapsed = false;

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/admin/dashboard',
      active: true,
    },
    {
      title: 'Clientes',
      icon: 'fas fa-users',
      route: '/admin/clientes',
      active: false,
    },
    {
      title: 'Planes',
      icon: 'fas fa-wifi',
      route: '/admin/planes',
      active: false,
    },
    {
      title: 'Facturación',
      icon: 'fas fa-file-invoice-dollar',
      route: '/admin/facturacion',
      active: false,
    },
    {
      title: 'Reportes',
      icon: 'fas fa-chart-bar',
      route: '/admin/reportes',
      active: false,
    },
    {
      title: 'Configuración',
      icon: 'fas fa-cog',
      route: '/admin/configuracion',
      active: false,
    },
  ];

  setActive(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}
