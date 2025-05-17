import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Interfaces para tipado
interface Client {
  id: number;
  name: string;
  documentType: string;
  documentNumber: string;
  email: string;
  location: string;
  phone: string;
  status: string;
  plan: string;
  registrationDate: string;
  lastPayment: string;
}

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  // Datos de ejemplo para la tabla de clientes
  clients: Client[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      documentType: 'Cédula',
      documentNumber: '1234567890',
      email: 'juan.perez@example.com',
      location: 'Calle 123 #45-67, Bogotá',
      phone: '3101234567',
      plan: 'Plan 250 Mbps',
      status: 'Activo',
      registrationDate: '2023-01-15',
      lastPayment: '2023-04-15',
    },
    {
      id: 2,
      name: 'María López',
      documentType: 'Cédula',
      documentNumber: '0987654321',
      email: 'maria.lopez@example.com',
      location: 'Carrera 45 #12-34, Medellín',
      phone: '3157654321',
      plan: 'Plan 150 Mbps',
      status: 'Activo',
      registrationDate: '2023-02-10',
      lastPayment: '2023-04-12',
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      documentType: 'Pasaporte',
      documentNumber: '5678901234',
      email: 'carlos.rodriguez@example.com',
      location: 'Avenida 67 #89-12, Cali',
      phone: '3209876543',
      plan: 'Plan 490 Mbps',
      status: 'Pendiente',
      registrationDate: '2023-03-05',
      lastPayment: '2023-03-28',
    },
    {
      id: 4,
      name: 'Ana Martínez',
      documentType: 'Cédula',
      documentNumber: '4321098765',
      email: 'ana.martinez@example.com',
      location: 'Diagonal 78 #56-34, Barranquilla',
      phone: '3003456789',
      plan: 'Plan 395 Mbps',
      status: 'Activo',
      registrationDate: '2023-02-20',
      lastPayment: '2023-04-10',
    },
    {
      id: 5,
      name: 'Pedro Sánchez',
      documentType: 'Cédula Extranjería',
      documentNumber: '9876543210',
      email: 'pedro.sanchez@example.com',
      location: 'Transversal 23 #45-67, Cartagena',
      phone: '3112345678',
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
  selectedClient: Client | null = null;
  clientHistory: HistoryItem[] = [];

  // Modal de nuevo/editar cliente
  showClientModal = false;
  isEditMode = false;
  newClient: Client = this.getEmptyClient();

  // Modal de confirmación de eliminación
  showDeleteModal = false;
  clientToDelete: Client | null = null;

  // Modal de detalles
  showDetailsModal = false;
  clientDetails: Client | null = null;

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

  // Opciones de tipo de documento
  documentTypes = ['Cédula', 'Cédula Extranjería', 'Pasaporte', 'NIT'];

  ngOnInit(): void {
    console.log('Componente de clientes inicializado');
  }

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
      const searchMatch =
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.documentNumber.includes(this.searchTerm) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone.includes(this.searchTerm) ||
        client.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statusMatch =
        this.statusFilter === 'Todos' || client.status === this.statusFilter;

      const planMatch =
        this.planFilter === 'Todos' || client.plan === this.planFilter;

      return searchMatch && statusMatch && planMatch;
    });
  }

  searchByDocument() {
    if (this.documentSearch.trim()) {
      this.searchTerm = '';
      this.statusFilter = 'Todos';
      this.planFilter = 'Todos';

      this.searchTerm = this.documentSearch.trim();

      const matchingClients = this.filteredClients;
      if (matchingClients.length === 1) {
        this.openHistoryModal(matchingClients[0]);
      }
    }
  }

  openDetailsModal(client: Client) {
    this.clientDetails = client;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.clientDetails = null;
  }

  openHistoryModal(client: Client) {
    this.selectedClient = client;
    this.clientHistory = this.historyData.filter(
      (item) => item.clientId === client.id
    );
    this.showHistoryModal = true;
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedClient = null;
  }

  openNewClientModal() {
    this.isEditMode = false;
    this.newClient = this.getEmptyClient();
    this.showClientModal = true;
  }

  openEditClientModal(client: Client) {
    this.isEditMode = true;
    this.newClient = { ...client };
    this.showClientModal = true;
  }

  closeClientModal() {
    this.showClientModal = false;
  }

  saveClient() {
    if (this.isEditMode) {
      const index = this.clients.findIndex((c) => c.id === this.newClient.id);
      if (index !== -1) {
        this.clients[index] = { ...this.newClient };
      }
    } else {
      const newId = Math.max(...this.clients.map((c) => c.id), 0) + 1;
      this.newClient.id = newId;
      this.newClient.registrationDate = new Date().toISOString().split('T')[0];
      this.clients.push({ ...this.newClient });
    }

    this.closeClientModal();
  }

  openDeleteModal(client: Client) {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  deleteClient() {
    if (this.clientToDelete) {
      this.clients = this.clients.filter(
        (c) => c.id !== this.clientToDelete!.id
      );
      this.closeDeleteModal();
    }
  }

  private getEmptyClient(): Client {
    return {
      id: 0,
      name: '',
      documentType: 'Cédula',
      documentNumber: '',
      email: '',
      location: '',
      phone: '',
      status: 'Activo',
      plan: 'Plan 250 Mbps',
      registrationDate: '',
      lastPayment: '',
    };
  }
}
