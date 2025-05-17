import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../entities/client.entity'; // Asegúrate que esta ruta existe

@Injectable({
  providedIn: 'root'
})
export class ClientesService { // El nombre DEBE coincidir con la clase
  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}