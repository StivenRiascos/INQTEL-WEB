import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/client.service';
import { Client } from '../../../entities/client.entity';
import { PlanService } from '../../../services/plan.service'; // Ajusta la ruta si es diferente
import { Plan } from '../../../entities/plan.entity';




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
    'activo',
    'Inactivo',
    'Suspendido',
  ];
  /*planOptions = [
  { id: 1, nombre: 'Plan 160mbps' },
  { id: 2, nombre: 'Plan 290mbps' },
  { id: 3, nombre: 'Plan 395mbps' },
  { id: 4, nombre: 'Plan 490mbps' },
  { id: 5, nombre: 'Plan 650mbps' },
];
*/

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
  planOptions: Plan[] = [];  // Lista que obtendrás del backend


  constructor(
  private clientesService: ClientesService,
  private planService: PlanService
) {}


  ngOnInit(): void {
  this.fetchClientsFromBackend();
  this.fetchPlansFromBackend();
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
fetchPlansFromBackend(): void {
  this.planService.getPlanes().subscribe({
    next: (planes) => {
      this.planOptions = planes.sort((a, b) => a.id - b.id); // Ordenar por id asc
    },
    error: (err) => {
      console.error('Error al cargar planes:', err);
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
    estado: 'activo',
    planId: 1,  // aquí asignas el id del plan por defecto (por ejemplo 1)
  };
}

getPlanNameById(id: number | undefined): string {
  const plan = this.planOptions.find(p => p.id === id);
  return plan ? plan.nombre : 'Desconocido';
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
          const plan = this.planOptions.find(p => p.nombre === this.planFilter);
          console.log('Filtro plan:', this.planFilter);
          console.log('Plan encontrado:', plan);
        if (plan) {
          // Usar directamente client.plan?.id porque planId está undefined
          const clientPlanId = client.plan?.id;
            console.log('Cliente planId:', clientPlanId, 'Plan id:', plan.id);
            planMatch = clientPlanId === plan.id;
        } else {
          planMatch = false;
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
    case 'activo':
      return 'badge status-active';
    case 'Inactivo':
      return 'badge status-inactive';
    case 'Suspendido':
    case 'Bloqueado':
      return 'badge status-blocked';
    default:
      return 'badge';
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

  formatEstado(estado: string): string {
  if (!estado) return 'Activo';

  const normalizado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  const valido = this.statusOptions.includes(normalizado);
  return valido ? normalizado : 'activo';
}


  openEditClientModal(client: Client): void {
  this.isEditMode = true;

  this.newClient = {
    ...client,
    estado: this.formatEstado(client.estado),
    planId: client.planId || client.plan?.id || 1,
  };

  this.showClientModal = true;
}


  closeClientModal(): void {
    this.showClientModal = false;
  }

  

  // Guarda un cliente nuevo o actualiza uno existente
  saveClient(): void {
  if (this.isEditMode) {
    // Actualizar cliente existente
    this.clientesService.updateCliente(this.newClient.id, this.newClient).subscribe({
      next: (updatedClient) => {
        // Actualizar la lista local de clientes con el cliente actualizado
        const index = this.clients.findIndex(c => c.id === updatedClient.id);
        if (index !== -1) {
          this.clients[index] = updatedClient;
          this.applyFilters();  // Si tienes filtros o paginación
        }
        this.closeClientModal();
      },
      error: (err) => {
        console.error('Error actualizando cliente:', err);
      }
    });
  } else {
    // Crear nuevo cliente
    this.clientesService.createCliente(this.newClient).subscribe({
      next: (createdClient) => {
        this.clients.push(createdClient);
        this.applyFilters();
        this.closeClientModal();
      },
      error: (err) => {
        console.error('Error creando cliente:', err);
      }
    });
  }
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
    this.clientesService.deleteCliente(this.clientToDelete.id).subscribe({
      next: () => {
        // Eliminación exitosa: actualiza la lista local
        this.clients = this.clients.filter(
          (c) => c.id !== this.clientToDelete!.id
        );
        this.applyFilters();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error al eliminar cliente', err);
        // Aquí puedes mostrar un mensaje de error al usuario
        }
      });
    }
  }
}
