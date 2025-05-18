import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/client.service';
import { Client } from '../../../entities/client.entity';




interface HistoryItem {
  date: string;
  type: string;
  typeLabel: string;
  description: string;
  details?: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true, // Si estás usando Angular 14+ con componentes standalone
  imports: [CommonModule, FormsModule], // Necesario para ngIf, ngFor, ngModel, etc.
})
export class ClientesComponent implements OnInit {
  // Datos de clientes
  clients: Client[] = [];
  filteredClients: Client[] = [];

  // Filtros
  searchTerm: string = '';
  documentSearch: string = '';
  statusFilter: string = 'Todos';
  planFilter: string = 'Todos';

  // Opciones para selects
  statusOptions: string[] = [
    'Todos',
    'Activo',
    'Inactivo',
    'Pendiente',
    'Suspendido',
  ];
  planOptions: string[] = [
    'Todos',
    'Básico',
    'Estándar',
    'Premium',
    'Empresarial',
  ];
  documentTypes: string[] = ['CC', 'NIT', 'CE', 'Pasaporte'];

  // Control de modales
  showDetailsModal: boolean = false;
  showHistoryModal: boolean = false;
  showClientModal: boolean = false;
  showDeleteModal: boolean = false;

  // Cliente seleccionado para diferentes operaciones
  clientDetails: Client | null = null;
  selectedClient: Client | null = null;
  clientToDelete: Client | null = null;

  // Nuevo cliente o cliente en edición
  newClient: Client = this.getEmptyClient();
  isEditMode: boolean = false;

  // Historial del cliente
  clientHistory: HistoryItem[] = [];

  constructor(private clientesService: ClientesService) {}


  ngOnInit(): void {
  this.fetchClientsFromBackend();
  }

  fetchClientsFromBackend(): void {
  this.clientesService.getClientes().subscribe({
    next: (data) => {
      this.clients = data;
      this.applyFilters();
    },
    error: (err) => {
      console.error('Error al cargar clientes:', err);
    }
  });
}


  // Inicializa un cliente vacío
  getEmptyClient(): Client {
    return {
      id: 0,
      nombre: '',
      tipoDocumento: 'CC',
      numeroDocumento: '',
      email: '',
      telefono: '',
      direccion: '',
      estado: 'Activo',
      plan: {
      id: 0,
      nombre: 'Básico',
      precio: 0,
    },
    };
  }


  // Aplica filtros a la lista de clientes
  applyFilters(): void {
    this.filteredClients = this.clients.filter((client) => {
      // Filtro por término de búsqueda
      const searchMatch =
        !this.searchTerm ||
        client.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por estado
      const statusMatch =
        this.statusFilter === 'Todos' || client.estado === this.statusFilter;

      // Filtro por plan
      let planMatch = this.planFilter === 'Todos';
      if (!planMatch) {
        if (typeof client.plan === 'object' && client.plan !== null) {
          planMatch = client.plan.nombre === this.planFilter;
        } else {
          planMatch = client.plan === this.planFilter;
        }
      }

      return searchMatch && statusMatch && planMatch;
    });
  }

  // Busca por número de documento
  searchByDocument(): void {
    if (this.documentSearch.trim()) {
      this.filteredClients = this.clients.filter((client) =>
        client.numeroDocumento.includes(this.documentSearch.trim())
      );
    } else {
      this.applyFilters();
    }
  }

  // Retorna la clase CSS según el estado del cliente
  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'badge-success';
      case 'Inactivo':
        return 'badge-secondary';
      case 'Pendiente':
        return 'badge-warning';
      case 'Suspendido':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  // Modal de detalles
  openDetailsModal(client: Client): void {
    this.clientDetails = { ...client };
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.clientDetails = null;
  }

  // Modal de historial
  openHistoryModal(client: Client): void {
    this.selectedClient = { ...client };
    this.loadClientHistory(client.id);
    this.showHistoryModal = true;
  }

  closeHistoryModal(): void {
    this.showHistoryModal = false;
    this.selectedClient = null;
    this.clientHistory = [];
  }

  // Carga el historial del cliente (datos de ejemplo)
  loadClientHistory(clientId: number): void {
    // Aquí normalmente harías una llamada a un servicio
    this.clientHistory = [
      {
        date: '2023-04-15',
        type: 'payment',
        typeLabel: 'Pago',
        description: 'Pago mensual realizado',
        details: 'Factura #12345 - $50.000',
      },
      {
        date: '2023-03-10',
        type: 'support',
        typeLabel: 'Soporte',
        description: 'Reporte de falla en el servicio',
        details: 'Ticket #789 - Resuelto',
      },
      {
        date: '2023-02-15',
        type: 'payment',
        typeLabel: 'Pago',
        description: 'Pago mensual realizado',
        details: 'Factura #12344 - $50.000',
      },
      {
        date: '2023-01-05',
        type: 'change',
        typeLabel: 'Cambio',
        description: 'Cambio de plan',
        details: 'De Básico a Premium',
      },
    ];

    // Filtramos por el ID del cliente (en un caso real)
    // this.clientHistory = this.clientHistory.filter(item => item.clientId === clientId);
  }

  // Modal de nuevo/editar cliente
  openNewClientModal(): void {
    this.isEditMode = false;
    this.newClient = this.getEmptyClient();
    this.showClientModal = true;
  }

  openEditClientModal(client: Client): void {
    this.isEditMode = true;
    this.newClient = { ...client };
    this.showClientModal = true;
  }

  closeClientModal(): void {
    this.showClientModal = false;
  }

  // Guarda un cliente nuevo o actualiza uno existente
  saveClient(): void {
    if (this.isEditMode) {
      // Actualizar cliente existente
      const index = this.clients.findIndex((c) => c.id === this.newClient.id);
      if (index !== -1) {
        this.clients[index] = { ...this.newClient };
      }
    } else {
      // Crear nuevo cliente
      const newId = Math.max(0, ...this.clients.map((c) => c.id)) + 1;
      this.newClient.id = newId;
      this.newClient.registrationDate = new Date().toISOString().split('T')[0];
      this.clients.push({ ...this.newClient });
    }

    this.applyFilters();
    this.closeClientModal();
  }

  // Modal de eliminación
  openDeleteModal(client: Client): void {
    this.clientToDelete = { ...client };
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  // Elimina un cliente
  deleteClient(): void {
    if (this.clientToDelete) {
      this.clients = this.clients.filter(
        (c) => c.id !== this.clientToDelete!.id
      );
      this.applyFilters();
      this.closeDeleteModal();
    }
  }
}
