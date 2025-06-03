export interface Plan {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  clientCount?: number;
    // Campos solo usados en el frontend (no vienen del backend)
  features?: string[];
  popular?: boolean;
}