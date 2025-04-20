import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir las interfaces para las respuestas esperadas del backend
interface PaymentResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:3000';  // Cambia la URL según la de tu backend

  constructor(private http: HttpClient) {}

  // Método para procesar un pago
  realizarPago(pagoData: any): Observable<PaymentResponse> {
    const url = `${this.baseUrl}/pagos`;  // Cambia el endpoint según tu backend
    return this.http.post<PaymentResponse>(url, pagoData);
  }

  // Método para buscar factura
  buscarFactura(busquedaData: any): Observable<PaymentResponse> {
    const url = `${this.baseUrl}/facturas/buscar`;  // Cambia el endpoint según tu backend
    return this.http.post<PaymentResponse>(url, busquedaData);
  }
}
