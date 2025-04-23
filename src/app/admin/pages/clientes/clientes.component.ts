import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoryItem {
  id: number;
  clientId: number;
  date: string;
  type: string;
  typeLabel: string;
  description: string;
  details?: string;
}

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

  // Datos de ejemplo para el historial de clientes
  historyData: HistoryItem[] = [
    {
      id: 1,
      clientId: 1,
      date: '2023-04-15',
      type: 'payment',
      typeLabel: 'Pago',
      description: 'Pago mensual del servicio',
      details: 'Valor: $85.000 - Método: Transferencia bancaria',
    },
    {
      id: 2,
      clientId: 1,
      date: '2023-03-16',
      type: 'payment',
      typeLabel: 'Pago',
      description: 'Pago mensual del servicio',
      details: 'Valor: $85.000 - Método: Efectivo',
    },
    {
      id: 3,
      clientId: 1,
      date: '2023-02-10',
      type: 'support',
      typeLabel: 'Soporte',
      description: 'Reporte de falla en el servicio',
      details: 'Problema: Intermitencia en la conexión - Resuelto',
    },
    {
      id: 4,
      clientId: 1,
      date: '2023-01-15',
      type: 'contract',
      typeLabel: 'Contrato',
      description: 'Inicio de servicio',
      details: 'Plan contratado: Plan 250 Mbps',
    },
    {
      id: 5,
      clientId: 2,
      date: '2023-04-12',
      type: 'payment',
      typeLabel: 'Pago',
      description: 'Pago mensual del servicio',
      details: 'Valor: $65.000 - Método: Tarjeta de crédito',
    },
    {
      id: 6,
      clientId: 2,
      date: '2023-03-10',
      type: 'payment',
      typeLabel: 'Pago',
      description: 'Pago mensual del servicio',
      details: 'Valor: $65.000 - Método: Tarjeta de crédito',
    },
    {
      id: 7,
      clientId: 2,
      date: '2023-02-10',
      type: 'contract',
      typeLabel: 'Contrato',
      description: 'Inicio de servicio',
      details: 'Plan contratado: Plan 150 Mbps',
    },
  ];

  // Filtros
  searchTerm = '';
  documentSearch = '';
  statusFilter = 'Todos';
  planFilter = 'Todos';

  // Modal de historial
  showHistoryModal = false;
  selectedClient: any = null;
  clientHistory: HistoryItem[] = [];

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

  // Método para buscar por cédula específicamente
  searchByDocument() {
    if (this.documentSearch.trim()) {
      // Limpiar otros filtros para enfocarse solo en la búsqueda por cédula
      this.searchTerm = '';
      this.statusFilter = 'Todos';
      this.planFilter = 'Todos';

      // Establecer la búsqueda específica por documento
      this.searchTerm = this.documentSearch.trim();

      // Si solo hay un resultado, podríamos mostrar directamente su historial
      const matchingClients = this.filteredClients;
      if (matchingClients.length === 1) {
        this.openHistoryModal(matchingClients[0]);
      }
    }
  }

  // Método para abrir el modal de historial
  openHistoryModal(client: any) {
    this.selectedClient = client;
    this.clientHistory = this.historyData.filter(
      (item) => item.clientId === client.id
    );
    this.showHistoryModal = true;
  }

  // Método para cerrar el modal de historial
  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedClient = null;
  }
}
