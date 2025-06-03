import { Client } from "./client.entity";
import { Pago } from "./pago.entity";

export enum EstadoFactura {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  ANULADA = 'ANULADA',
}
export interface Factura {
  id: number;
  concepto: string;
  valor: number;
  fecha: string; // ISO date string
  fechaLimite?: Date; // Puede ser null
  cliente: Client;
  estado: EstadoFactura;
  pagos: Pago[];
}
