import { Plan } from "./plan.entity";

export interface Client {
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