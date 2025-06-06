import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/client.service';
import { Client } from '../../../entities/client.entity';
import { PlanService } from '../../../services/plan.service';
import { Plan } from '../../../entities/plan.entity';
import { FacturaService } from '../../../services/factura.service';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientesComponent implements OnInit {
  // --- Propiedades para paginación ---
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedClients: Client[] = [];

  // Datos de clientes
  clients: Client[] = [];
  filteredClients: Client[] = [];

  // Filtros
  searchTerm: string = '';
  documentSearch: string = '';
  statusFilter: string = 'Todos';
  planFilter: string = 'Todos';

  // Opciones para selects
  statusOptions: string[] = ['Todos', 'activo', 'Inactivo', 'Suspendido'];
  documentTypes: string[] = ['CC', 'NIT', 'CE', 'Pasaporte'];
  planOptions: Plan[] = [];

  // Control de modales
  showDetailsModal: boolean = false;
  showHistoryModal: boolean = false;
  showClientModal: boolean = false;
  showDeleteModal: boolean = false;

  // Cliente seleccionado
  clientDetails: Client | null = null;
  selectedClient: Client | null = null;
  clientToDelete: Client | null = null;

  // Nuevo cliente o cliente en edición
  newClient: Client = this.getEmptyClient();
  isEditMode: boolean = false;

  // Historial del cliente
  clientHistory: HistoryItem[] = [];

  constructor(
    private clientesService: ClientesService,
    private facturaService: FacturaService,
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
      error: (err) => console.error('Error al cargar clientes:', err),
    });
  }

  fetchPlansFromBackend(): void {
    this.planService.getPlanes().subscribe({
      next: (planes) => {
        this.planOptions = planes.sort((a, b) => a.id - b.id);
      },
      error: (err) => console.error('Error al cargar planes:', err),
    });
  }

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
      planId: 1,
    };
  }

  getPlanNameById(id: number | undefined): string {
    const plan = this.planOptions.find((p) => p.id === id);
    return plan ? plan.nombre : 'Desconocido';
  }

  applyFilters(): void {
    let tempClients = this.clients.filter((client) => {
      const searchMatch =
        !this.searchTerm ||
        client.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statusMatch =
        this.statusFilter === 'Todos' || client.estado === this.statusFilter;

      let planMatch = this.planFilter === 'Todos';
      if (!planMatch) {
        const plan = this.planOptions.find((p) => p.nombre === this.planFilter);
        if (plan) {
          const clientPlanId = client.plan?.id;
          planMatch = clientPlanId === plan.id;
        } else {
          planMatch = false;
        }
      }
      return searchMatch && statusMatch && planMatch;
    });

    // Asignar los clientes filtrados
    this.filteredClients = tempClients;
    // Reiniciar la paginación
    this.currentPage = 1;
    this.totalPages = Math.ceil(
      this.filteredClients.length / this.itemsPerPage
    );
    this.updatePaginatedClients();
  }

  searchByDocument(): void {
    if (this.documentSearch.trim()) {
      this.filteredClients = this.clients.filter((client) =>
        client.numeroDocumento.includes(this.documentSearch.trim())
      );
    } else {
      this.filteredClients = [...this.clients];
    }
    // Reiniciar la paginación después de la búsqueda
    this.currentPage = 1;
    this.totalPages = Math.ceil(
      this.filteredClients.length / this.itemsPerPage
    );
    this.updatePaginatedClients();
  }

  // --- Nuevas funciones para paginación ---
  updatePaginatedClients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClients = this.filteredClients.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedClients();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedClients();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedClients();
    }
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  // Carga el historial del cliente
  // Carga el historial del cliente
  loadClientHistory(clienteId: number): void {
    this.facturaService.obtenerHistorialFacturas(clienteId).subscribe({
      next: (facturas) => {
        this.clientHistory = facturas.map((factura) => {
          let type = 'payment';
          let typeLabel = 'Pago';

          if (factura.estado === 'pendiente') {
            type = 'pending';
            typeLabel = 'Pendiente';
          } else if (factura.estado === 'cancelado') {
            type = 'cancel';
            typeLabel = 'Cancelado';
          }
          // Convierte la fecha de la factura a mes y año (ej: "Agosto 2025")
          const mesFacturado = new Date(factura.fecha).toLocaleDateString(
            'es-ES',
            {
              year: 'numeric',
              month: 'long',
            }
          );

          return {
            date:
              factura.pagos?.[0]?.fechaPago ||
              factura.fechaLimite ||
              factura.fecha,
            type,
            typeLabel,
            description: `Factura ${factura.estado} - ${mesFacturado}`,
            details: `Factura #${factura.id} - $${factura.valor}`,
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener historial de facturas:', error);
      },
    });
  }

  descargarFacturaPDF(item: any): void {
    const match = item.details?.match(/#(\d+)/);
    const facturaId = match ? match[1] : null;

    if (!facturaId) {
      console.error('ID de factura no encontrado');
      return;
    }

    const url = `http://localhost:3000/facturas/pdf/${facturaId}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${facturaId}.pdf`;
    a.target = '_blank';
    a.click();
  }

  // Modal de nuevo/editar cliente
  openNewClientModal(): void {
    this.isEditMode = false;
    this.newClient = this.getEmptyClient();
    this.showClientModal = true;
  }

  formatEstado(estado: string): string {
    if (!estado) return 'Activo';

    const normalizado =
      estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
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
      this.clientesService
        .updateCliente(this.newClient.id, this.newClient)
        .subscribe({
          next: (updatedClient) => {
            // Actualizar la lista local de clientes con el cliente actualizado
            const index = this.clients.findIndex(
              (c) => c.id === updatedClient.id
            );
            if (index !== -1) {
              this.clients[index] = updatedClient;
              this.applyFilters(); // Si tienes filtros o paginación
            }
            this.closeClientModal();
          },
          error: (err) => {
            console.error('Error actualizando cliente:', err);
          },
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
        },
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
        },
      });
    }
  }
}
