import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
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
      .post<PaymentResponse>(`${this.baseUrl}pagos`, pagoData)
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

  // Obtener ingresos mensuales
  getIngresosMensuales(): Observable<number> {
    return this.http.get<number>(
      environment.apiUrl + 'pagos/ingresos-mensuales'
    );
  }

  // 🔹 Método simulado para procesar pagos por PSE
  processPSEPayment(paymentData: any): Observable<PaymentResponse> {
    // En producción puedes cambiar esto por una llamada real a tu backend
    console.log('Simulando pago por PSE:', paymentData);
    return of({
      success: true,
      message: 'Redirigiendo al banco seleccionado para completar el pago...',
      data: paymentData,
    });
  }

  // 🔹 Método simulado para procesar pagos con tarjeta
  processCardPayment(paymentData: any): Observable<PaymentResponse> {
    console.log('Simulando pago con tarjeta:', paymentData);
    return of({
      success: true,
      message: 'Pago procesado correctamente con tarjeta.',
      data: paymentData,
    });
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
