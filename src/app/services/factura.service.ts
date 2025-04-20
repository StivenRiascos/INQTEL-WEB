// src/app/services/factura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = 'http://localhost:3000/facturas';  // Cambia a la URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para obtener todas las facturas
  obtenerFacturas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para obtener una factura por cédula
  obtenerFacturaPorCedula(cedula: string): Observable<any> {
    // Cambia la ruta para que sea directamente '/facturas/{cedula}'
    return this.http.get<any>(`${this.apiUrl}/${cedula}`);
  }

  // Método para obtener una factura por contrato
  obtenerFacturaPorContrato(contrato: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar-por-contrato/${contrato}`);
  }
}
