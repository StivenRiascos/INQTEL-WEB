// src/app/services/factura.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = environment.apiUrl + 'facturas'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para obtener todas las facturas
  obtenerFacturas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // NUEVOS MÉTODOS AGREGADOS PARA EL COMPONENTE DE FACTURAS
  getFacturas(): Observable<any[]> {
    return this.obtenerFacturas(); // Reutiliza el método existente
  }

  createFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }

  updateFactura(id: number, factura: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, factura);
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
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
