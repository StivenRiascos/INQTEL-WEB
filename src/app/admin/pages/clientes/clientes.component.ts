import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent {
  // Datos de ejemplo para la tabla de clientes
  clients = [
    {
      id: 1,
      name: 'Juan Pérez',
      document: '1234567890',
      address: 'Calle 123 #45-67',
      phone: '3101234567',
      email: 'juan.perez@example.com',
      plan: 'Plan 250 Mbps',
      status: 'Activo',
      registrationDate: '2023-01-15',
      lastPayment: '2023-04-15',
    },
    {
      id: 2,
      name: 'María López',
      document: '0987654321',
      address: 'Carrera 45 #12-34',
      phone: '3157654321',
      email: 'maria.lopez@example.com',
      plan: 'Plan 150 Mbps',
      status: 'Activo',
      registrationDate: '2023-02-10',
      lastPayment: '2023-04-12',
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      document: '5678901234',
      address: 'Avenida 67 #89-12',
      phone: '3209876543',
      email: 'carlos.rodriguez@example.com',
      plan: 'Plan 490 Mbps',
      status: 'Pendiente',
      registrationDate: '2023-03-05',
      lastPayment: '2023-03-28',
    },
    {
      id: 4,
      name: 'Ana Martínez',
      document: '4321098765',
      address: 'Diagonal 78 #56-34',
      phone: '3003456789',
      email: 'ana.martinez@example.com',
      plan: 'Plan 395 Mbps',
      status: 'Activo',
      registrationDate: '2023-02-20',
      lastPayment: '2023-04-10',
    },
    {
      id: 5,
      name: 'Pedro Sánchez',
      document: '9876543210',
      address: 'Transversal 23 #45-67',
      phone: '3112345678',
      email: 'pedro.sanchez@example.com',
      plan: 'Plan 650 Mbps',
      status: 'Inactivo',
      registrationDate: '2023-01-25',
      lastPayment: '2023-03-15',
    },
  ];

  // Filtros
  searchTerm = '';
  statusFilter = 'Todos';
  planFilter = 'Todos';

  // Opciones de filtro
  statusOptions = ['Todos', 'Activo', 'Pendiente', 'Inactivo'];
  planOptions = [
    'Todos',
    'Plan 150 Mbps',
    'Plan 250 Mbps',
    'Plan 395 Mbps',
    'Plan 490 Mbps',
    'Plan 650 Mbps',
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

  get filteredClients() {
    return this.clients.filter((client) => {
      // Filtro por término de búsqueda
      const searchMatch =
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.document.includes(this.searchTerm) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone.includes(this.searchTerm);

      // Filtro por estado
      const statusMatch =
        this.statusFilter === 'Todos' || client.status === this.statusFilter;

      // Filtro por plan
      const planMatch =
        this.planFilter === 'Todos' || client.plan === this.planFilter;

      return searchMatch && statusMatch && planMatch;
    });
  }
}
