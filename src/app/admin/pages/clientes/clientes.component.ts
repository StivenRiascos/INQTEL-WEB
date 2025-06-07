// src/app/admin/pages/clientes/clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/client.service';
import { Client } from '../../../entities/client.entity';
import { PlanService } from '../../../services/plan.service';
import { Plan } from '../../../entities/plan.entity';
import { FacturaService } from '../../../services/factura.service';

// 1. AÑADIR LA PROPIEDAD 'facturaId' A LA INTERFAZ
interface HistoryItem {
  date: string;
  type: string;
  typeLabel: string;
  description: string;
  details?: string;
  facturaId?: number;
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
  isLoading = true;

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
        this.isLoading = false; // <-- AÑADIR AQUÍ
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading = false; // <-- AÑADIR AQUÍ
      },
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

  // 2. MÉTODO CORREGIDO PARA CARGAR EL HISTORIAL
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

          const mesFacturado = new Date(factura.fecha).toLocaleDateString(
            'es-ES',
            { year: 'numeric', month: 'long' }
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
            facturaId: factura.id, // Se asigna el ID aquí
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener historial de facturas:', error);
      },
    });
  }

  // 3. MÉTODO CORREGIDO PARA DESCARGAR EL PDF
  descargarFacturaPDF(item: HistoryItem): void {
    const facturaId = item.facturaId; // Ahora la propiedad existe y se usa correctamente
    if (!facturaId) {
      console.error('ID de factura no encontrado en el item del historial');
      return;
    }

    this.facturaService.descargarFacturaPDF(facturaId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${facturaId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
        alert('No se pudo descargar la factura. Por favor, intente de nuevo.');
      },
    });
  }

  // --- El resto de los métodos se mantienen igual ---
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
    this.filteredClients = tempClients;
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
    this.currentPage = 1;
    this.totalPages = Math.ceil(
      this.filteredClients.length / this.itemsPerPage
    );
    this.updatePaginatedClients();
  }
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
  openDetailsModal(client: Client): void {
    this.clientDetails = { ...client };
    this.showDetailsModal = true;
  }
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.clientDetails = null;
  }
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
  formatEstado(estado: string): string {
    if (!estado) return 'Activo';
    const normalizado =
      estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    const valido = this.statusOptions.includes(normalizado);
    return valido ? normalizado : 'activo';
  }
  openNewClientModal(): void {
    this.isEditMode = false;
    this.newClient = this.getEmptyClient();
    this.showClientModal = true;
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
  saveClient(): void {
    if (this.isEditMode) {
      this.clientesService
        .updateCliente(this.newClient.id, this.newClient)
        .subscribe({
          next: (updatedClient) => {
            const index = this.clients.findIndex(
              (c) => c.id === updatedClient.id
            );
            if (index !== -1) {
              this.clients[index] = updatedClient;
              this.applyFilters();
            }
            this.closeClientModal();
          },
          error: (err) => {
            console.error('Error actualizando cliente:', err);
          },
        });
    } else {
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
  openDeleteModal(client: Client): void {
    this.clientToDelete = { ...client };
    this.showDeleteModal = true;
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }
  deleteClient(): void {
    if (this.clientToDelete) {
      this.clientesService.deleteCliente(this.clientToDelete.id).subscribe({
        next: () => {
          this.clients = this.clients.filter(
            (c) => c.id !== this.clientToDelete!.id
          );
          this.applyFilters();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error al eliminar cliente', err);
        },
      });
    }
  }
}
