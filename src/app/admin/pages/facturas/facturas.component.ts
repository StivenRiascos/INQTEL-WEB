import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';
import { ClientesService } from '../../../services/client.service';
import { Factura } from '../../../entities/factura.entity';
import { Client } from '../../../entities/client.entity';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class FacturasComponent implements OnInit {
  // Datos de facturas
  facturas: Factura[] = [];
  filteredFacturas: Factura[] = [];
  facturasProximasVencer: Factura[] = [];
  clientes: Client[] = [];

  // Filtros
  searchTerm: string = '';
  mesFilter: string = 'Todos';
  estadoFilter: string = 'Todos';
  yearFilter: number = new Date().getFullYear();

  // Opciones para selects
  estadosOptions: string[] = [
    'Todos',
    'pendiente',
    'pagado',
    'vencido',
    'cancelado',
  ];

  mesesOptions = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  yearsOptions: number[] = [];

  // Control de modales
  showDetailsModal: boolean = false;
  showFacturaModal: boolean = false;
  showDeleteModal: boolean = false;

  // Factura seleccionada para diferentes operaciones
  facturaDetails: Factura | null = null;
  facturaToDelete: Factura | null = null;

  // Nueva factura o factura en edición
  newFactura: Factura = this.getEmptyFactura();
  isEditMode: boolean = false;

  constructor(
    private facturaService: FacturaService,
    private clientesService: ClientesService
  ) {
    // Generar años (últimos 5 años y próximos 2)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      this.yearsOptions.push(i);
    }
  }

  ngOnInit(): void {
    this.fetchFacturasFromBackend();
    this.fetchClientesFromBackend();
  }

  fetchFacturasFromBackend(): void {
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.calcularFacturasProximasVencer();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar facturas:', err);
      },
    });
  }

  fetchClientesFromBackend(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  // Inicializa una factura vacía
  getEmptyFactura(): Factura {
    return {
      id: 0,
      clienteId: 0,
      fecha: new Date().toISOString().split('T')[0],
      fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      valor: 0,
      estado: 'pendiente',
    };
  }

  // Calcula facturas próximas a vencer (próximos 7 días)
  calcularFacturasProximasVencer(): void {
    const hoy = new Date();
    const proximosSieteDias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

    this.facturasProximasVencer = this.facturas.filter((factura) => {
      const fechaLimite = new Date(factura.fechaLimite);
      return (
        fechaLimite >= hoy &&
        fechaLimite <= proximosSieteDias &&
        factura.estado === 'pendiente'
      );
    });
  }

  // Aplica filtros a la lista de facturas
  applyFilters(): void {
    this.filteredFacturas = this.facturas.filter((factura) => {
      // Filtro por término de búsqueda
      const clienteNombre = this.getClienteNombre(factura.clienteId);
      const searchMatch =
        !this.searchTerm ||
        clienteNombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        factura.id.toString().includes(this.searchTerm);

      // Filtro por estado
      const estadoMatch =
        this.estadoFilter === 'Todos' || factura.estado === this.estadoFilter;

      // Filtro por mes
      const fechaFactura = new Date(factura.fecha);
      const mesMatch =
        this.mesFilter === 'Todos' ||
        fechaFactura.getMonth() + 1 === parseInt(this.mesFilter);

      // Filtro por año
      const yearMatch = fechaFactura.getFullYear() === this.yearFilter;

      return searchMatch && estadoMatch && mesMatch && yearMatch;
    });
  }

  // Obtiene el nombre del cliente por ID
  getClienteNombre(clienteId: number): string {
    const cliente = this.clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  }

  // Retorna la clase CSS según el estado de la factura
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'pagado':
        return 'badge status-paid';
      case 'pendiente':
        return 'badge status-pending';
      case 'vencido':
        return 'badge status-overdue';
      case 'cancelado':
        return 'badge status-cancelled';
      default:
        return 'badge';
    }
  }

  // Obtiene el mes facturado en formato texto
  getMesFacturado(fecha: string): string {
    const date = new Date(fecha);
    const mes = this.mesesOptions.find((m) => m.value === date.getMonth() + 1);
    return mes ? `${mes.label} ${date.getFullYear()}` : 'N/A';
  }

  // Calcula días para vencer
  getDiasParaVencer(fechaLimite: string): number {
    const hoy = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  // Retorna clase CSS según días para vencer
  getDiasVencerClass(dias: number): string {
    if (dias < 0) return 'dias-vencido';
    if (dias <= 3) return 'dias-critico';
    if (dias <= 7) return 'dias-advertencia';
    return 'dias-normal';
  }

  // Modal de detalles
  openDetailsModal(factura: Factura): void {
    this.facturaDetails = { ...factura };
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.facturaDetails = null;
  }

  // Modal de nueva/editar factura
  openNewFacturaModal(): void {
    this.isEditMode = false;
    this.newFactura = this.getEmptyFactura();
    this.showFacturaModal = true;
  }

  openEditFacturaModal(factura: Factura): void {
    this.isEditMode = true;
    this.newFactura = { ...factura };
    this.showFacturaModal = true;
  }

  closeFacturaModal(): void {
    this.showFacturaModal = false;
  }

  // Guarda una factura nueva o actualiza una existente
  saveFactura(): void {
    if (this.isEditMode) {
      this.facturaService
        .updateFactura(this.newFactura.id, this.newFactura)
        .subscribe({
          next: (updatedFactura) => {
            const index = this.facturas.findIndex(
              (f) => f.id === updatedFactura.id
            );
            if (index !== -1) {
              this.facturas[index] = updatedFactura;
              this.calcularFacturasProximasVencer();
              this.applyFilters();
            }
            this.closeFacturaModal();
          },
          error: (err) => {
            console.error('Error actualizando factura:', err);
          },
        });
    } else {
      this.facturaService.createFactura(this.newFactura).subscribe({
        next: (createdFactura) => {
          this.facturas.push(createdFactura);
          this.calcularFacturasProximasVencer();
          this.applyFilters();
          this.closeFacturaModal();
        },
        error: (err) => {
          console.error('Error creando factura:', err);
        },
      });
    }
  }

  // Modal de eliminación
  openDeleteModal(factura: Factura): void {
    this.facturaToDelete = { ...factura };
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.facturaToDelete = null;
  }

  // Elimina una factura
  deleteFactura(): void {
    if (this.facturaToDelete) {
      this.facturaService.deleteFactura(this.facturaToDelete.id).subscribe({
        next: () => {
          this.facturas = this.facturas.filter(
            (f) => f.id !== this.facturaToDelete!.id
          );
          this.calcularFacturasProximasVencer();
          this.applyFilters();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error al eliminar factura', err);
        },
      });
    }
  }

  // Descarga PDF de la factura
  descargarFacturaPDF(facturaId: number): void {
    const url = `http://localhost:3000/facturas/pdf/${facturaId}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${facturaId}.pdf`;
    a.target = '_blank';
    a.click();
  }
}
