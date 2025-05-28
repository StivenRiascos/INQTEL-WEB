import { Client } from './client.entity';

export interface Factura {
  id: number;
  clienteId: number;
  fecha: string; // Fecha de emisión en formato ISO (YYYY-MM-DD)
  fechaLimite: string; // Fecha límite de pago en formato ISO (YYYY-MM-DD)
  valor: number;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  descripcion?: string; // Opcional: descripción de la factura
  numeroFactura?: string; // Opcional: número de factura personalizado

  // Relaciones opcionales (si las necesitas)
  cliente?: Client;
  pagos?: Pago[];

  // Campos de auditoría opcionales
  fechaCreacion?: string;
  fechaActualizacion?: string;
  creadoPor?: number;
  actualizadoPor?: number;
}

// Interfaz opcional para los pagos relacionados
export interface Pago {
  id: number;
  facturaId: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  referencia?: string;
  estado: 'completado' | 'pendiente' | 'fallido';
}

// Interfaz para crear una nueva factura (sin ID)
export interface CreateFacturaDto {
  clienteId: number;
  fecha: string;
  fechaLimite: string;
  valor: number;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  descripcion?: string;
  numeroFactura?: string;
}

// Interfaz para actualizar una factura
export interface UpdateFacturaDto {
  clienteId?: number;
  fecha?: string;
  fechaLimite?: string;
  valor?: number;
  estado?: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  descripcion?: string;
  numeroFactura?: string;
}

// Interfaz para filtros de búsqueda
export interface FacturaFilters {
  clienteId?: number;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  mes?: number;
  año?: number;
  valorMinimo?: number;
  valorMaximo?: number;
}

// Interfaz para estadísticas de facturas
export interface FacturaStats {
  totalFacturas: number;
  totalPendientes: number;
  totalPagadas: number;
  totalVencidas: number;
  montoTotal: number;
  montoPendiente: number;
  montoPagado: number;
  promedioFactura: number;
}
