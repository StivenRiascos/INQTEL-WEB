// src/app/services/factura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = 'http://localhost:3000/facturas';  // URL del backend

  constructor(private http: HttpClient) {}

  // Método para obtener todas las facturas
  obtenerFacturas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

    // Método para obtener el historial de facturas por cliente (usando el clienteId)
  obtenerHistorialFacturas(clienteId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/historial/${clienteId}`);
  }
  
  // Método para obtener una factura por cédula
  obtenerFacturaPorCedula(cedula: string): Observable<any> {
    // Cambiar la URL para que apunte al endpoint correcto con la ruta 'consulta'
    return this.http.get<any>(`${this.apiUrl}/consulta/${cedula}`);
  }

  descargarFacturaPDF(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/pdf/${id}`, {
    responseType: 'blob', // ← importante para descargar archivos
  });
}
}
