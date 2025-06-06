import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface para respuestas
export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = environment.apiUrl; // Mantenemos tu estructura actual

  constructor(private http: HttpClient) {}

  // Método para procesar pagos (POST a /pagos)
  realizarPago(pagoData: {
    facturaId: number;
    monto: number;
    fechaPago: string;
  }): Observable<PaymentResponse> {
    return this.http
      .post<PaymentResponse>(`${this.baseUrl}/pagos`, pagoData)
      .pipe(catchError(this.handleError));
  }

  // Método para buscar facturas (POST a /facturas/buscar)
  buscarFactura(params: {
    tipoDocumento: string;
    numeroDocumento: string;
  }): Observable<PaymentResponse> {
    return this.http
      .post<PaymentResponse>(`${this.baseUrl}/facturas/buscar`, params)
      .pipe(catchError(this.handleError));
  }
  getIngresosMensuales(): Observable<number> {
    return this.http.get<number>(
      environment.apiUrl + 'pagos/ingresos-mensuales'
    );
  }

  // Manejo de errores mejorado
  private handleError(error: any) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Error del servidor
      errorMessage = `Código ${error.status}: ${
        error.error?.message || error.statusText
      }`;
    }

    console.error('Error en el servicio:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
