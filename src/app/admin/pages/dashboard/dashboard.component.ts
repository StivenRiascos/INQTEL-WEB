import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Datos de ejemplo para las tarjetas de estadísticas
  statsCards = [
    {
      title: 'Total Clientes',
      value: 256,
      icon: 'fas fa-users',
      color: 'primary',
      increase: 12,
      period: 'desde el mes pasado',
    },
    {
      title: 'Ingresos Mensuales',
      value: '$12,580,000',
      icon: 'fas fa-dollar-sign',
      color: 'success',
      increase: 8,
      period: 'desde el mes pasado',
    },
    {
      title: 'Nuevos Clientes',
      value: 24,
      icon: 'fas fa-user-plus',
      color: 'info',
      increase: 15,
      period: 'este mes',
    },
    {
      title: 'Tickets de Soporte',
      value: 18,
      icon: 'fas fa-ticket-alt',
      color: 'warning',
      increase: -5,
      period: 'desde el mes pasado',
    },
  ];

  // Datos de ejemplo para la tabla de clientes recientes
  recentClients = [
    {
      id: 1,
      name: 'Juan Pérez',
      plan: 'Plan 250 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-15',
      amount: '$75,000',
    },
    {
      id: 2,
      name: 'María López',
      plan: 'Plan 150 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-12',
      amount: '$54,000',
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      plan: 'Plan 490 Mbps',
      status: 'Pendiente',
      lastPayment: '2023-03-28',
      amount: '$99,000',
    },
    {
      id: 4,
      name: 'Ana Martínez',
      plan: 'Plan 395 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-10',
      amount: '$85,000',
    },
    {
      id: 5,
      name: 'Pedro Sánchez',
      plan: 'Plan 650 Mbps',
      status: 'Inactivo',
      lastPayment: '2023-03-15',
      amount: '$120,000',
    },
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'badge-success';
      case 'Pendiente':
        return 'badge-warning';
      case 'Inactivo':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}
