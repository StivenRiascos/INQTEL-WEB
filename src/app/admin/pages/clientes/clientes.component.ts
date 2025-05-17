import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/client.service';

interface Plan {
  id: number;
  nombre: string;
  precio: number;
}

interface Client {
  id: number;
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  direccion: string;
  telefono: string;
  estado: string;
  plan?: Plan;
  registrationDate?: string;
  lastPayment?: string;
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
  clients: Client[] = [];
  historyData: HistoryItem[] = [];

  // Filtros
  searchTerm = '';
  documentSearch = '';
  statusFilter = 'Todos';
  planFilter = 'Todos';

  // Modales
  showHistoryModal = false;
  selectedClient: Client | null = null;
  clientHistory: HistoryItem[] = [];
  showClientModal = false;
  isEditMode = false;
  newClient: Client = this.getEmptyClient();
  showDeleteModal = false;
  clientToDelete: Client | null = null;
  showDetailsModal = false;
  clientDetails: Client | null = null;

  // Opciones
  statusOptions = ['Todos', 'Activo', 'Pendiente', 'Inactivo'];
  planOptions = [
    'Todos',
    'Plan 150 Mbps',
    'Plan 250 Mbps',
    'Plan 395 Mbps',
    'Plan 490 Mbps',
    'Plan 650 Mbps',
  ];
  documentTypes = ['Cédula', 'Cédula Extranjería', 'Pasaporte', 'NIT'];

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data: Client[]) => {
        this.clients = data.map((client: Client) => ({
          ...client,
          name: client.nombre,             // Para compatibilidad con la plantilla
          documentType: client.tipoDocumento,
          documentNumber: client.numeroDocumento,
          location: client.direccion,
          phone: client.telefono,
          status: client.estado,
        }));
      },
      error: (error: any) => {
        console.error('Error cargando clientes:', error);
      }
    });
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
    return this.clients.filter(client => {
      const searchMatch =
        client.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.numeroDocumento.includes(this.searchTerm) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.telefono.includes(this.searchTerm) ||
        client.direccion.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statusMatch = this.statusFilter === 'Todos' || client.estado === this.statusFilter;
      const planMatch = this.planFilter === 'Todos' || client.plan?.nombre === this.planFilter;

      return searchMatch && statusMatch && planMatch;
    });
  }

  searchByDocument() {
    if (this.documentSearch.trim()) {
      this.searchTerm = this.documentSearch.trim();
      this.statusFilter = 'Todos';
      this.planFilter = 'Todos';

      const matchingClients = this.filteredClients;
      if (matchingClients.length === 1) {
        this.openHistoryModal(matchingClients[0]);
      }
    }
  }

  // Métodos para modales

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
    this.clientHistory = this.historyData.filter(item => item.clientId === client.id);
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
      const index = this.clients.findIndex(c => c.id === this.newClient.id);
      if (index !== -1) this.clients[index] = { ...this.newClient };
    } else {
      const newId = Math.max(...this.clients.map(c => c.id), 0) + 1;
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
      this.clients = this.clients.filter(c => c.id !== this.clientToDelete!.id);
      this.closeDeleteModal();
    }
  }

  private getEmptyClient(): Client {
    return {
      id: 0,
      nombre: '',
      tipoDocumento: 'Cédula',
      numeroDocumento: '',
      email: '',
      direccion: '',
      telefono: '',
      estado: 'Activo',
      plan: { id: 1, nombre: 'Plan 150 Mbps', precio: 54000},
      registrationDate: '',
      lastPayment: '',
    };
  }
}
