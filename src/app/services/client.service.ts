import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../entities/client.entity'; // Asegúrate que esta ruta es correcta

// DTO para crear cliente (opcional, si quieres mejor tipado)
export interface CreateClientDto {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  direccion: string;
  planId?: number;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = 'http://localhost:3000/clientes'; // Asegúrate que esta URL coincide con la de tu backend

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  createCliente(createClientDto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, createClientDto);
  }
}
