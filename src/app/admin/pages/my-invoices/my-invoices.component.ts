// src/app/admin/pages/my-invoices/my-invoices.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';
import { AuthService } from '../../../services/auth.service';
import { Factura } from '../../../entities/factura.entity';

@Component({
  selector: 'app-my-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.scss'],
})
export class MyInvoicesComponent implements OnInit {
  invoices: Factura[] = []; // Lista maestra de facturas
  filteredInvoices: Factura[] = []; // Lista que se mostrará en la plantilla
  isLoading = true;
  error: string | null = null;

  // Propiedades para los filtros
  availableYears: number[] = [];
  selectedYear: number | 'todos' = 'todos';
  selectedMonth: string = 'todos';

  months = [
    { value: 'todos', name: 'Todos los meses' },
    { value: '0', name: 'Enero' },
    { value: '1', name: 'Febrero' },
    { value: '2', name: 'Marzo' },
    { value: '3', name: 'Abril' },
    { value: '4', name: 'Mayo' },
    { value: '5', name: 'Junio' },
    { value: '6', name: 'Julio' },
    { value: '7', name: 'Agosto' },
    { value: '8', name: 'Septiembre' },
    { value: '9', name: 'Octubre' },
    { value: '10', name: 'Noviembre' },
    { value: '11', name: 'Diciembre' },
  ];

  constructor(
    private facturaService: FacturaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.facturaService.obtenerHistorialFacturas(currentUser.id).subscribe({
        next: (data) => {
          this.invoices = data.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );

          // Genera dinámicamente la lista de años a partir de las facturas
          const years = new Set(
            this.invoices.map((inv) => new Date(inv.fecha).getFullYear())
          );
          this.availableYears = Array.from(years).sort((a, b) => b - a); // Ordena de más reciente a más antiguo

          this.filterInvoices();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user invoices:', err);
          this.error =
            'No se pudieron cargar las facturas. Por favor, intente más tarde.';
          this.isLoading = false;
        },
      });
    } else {
      this.error = 'No se pudo identificar al usuario.';
      this.isLoading = false;
    }
  }

  filterInvoices(): void {
    let tempInvoices = this.invoices;

    // 1. Filtrar por Año
    if (this.selectedYear !== 'todos') {
      tempInvoices = tempInvoices.filter(
        (invoice) => new Date(invoice.fecha).getFullYear() === this.selectedYear
      );
    }

    // 2. Filtrar por Mes (sobre el resultado del filtro de año)
    if (this.selectedMonth !== 'todos') {
      const month = parseInt(this.selectedMonth, 10);
      tempInvoices = tempInvoices.filter(
        (invoice) => new Date(invoice.fecha).getUTCMonth() === month
      );
    }

    this.filteredInvoices = tempInvoices;
  }

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'pagado':
        return 'status-paid';
      case 'pendiente':
        return 'status-pending';
      case 'vencido':
        return 'status-overdue';
      default:
        return 'status-default';
    }
  }

  downloadInvoice(facturaId: number): void {
    this.facturaService.descargarFacturaPDF(facturaId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${facturaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
}
