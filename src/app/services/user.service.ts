// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ClientProfile {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  rol: string;
  plan?: any;
  avatarUrl?: string;
  // otros campos que tengas en Client
}

// Interfaz para la respuesta esperada del backend al cambiar contraseña
export interface ChangePasswordResponse {
  message: string;
  // puedes añadir otros campos si el backend los devuelve
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + 'clientes'; // o la URL que uses en backend

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<ClientProfile> {
    return this.http
      .get<ClientProfile>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateUser(
    id: number,
    data: Partial<ClientProfile>
  ): Observable<ClientProfile> {
    return this.http
      .put<ClientProfile>(`${this.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Envía una solicitud para cambiar la contraseña del usuario.
   * @param userId El ID del usuario.
   * @param currentPassword La contraseña actual del usuario.
   * @param newPassword La nueva contraseña deseada.
   * @returns Un Observable con la respuesta del servidor.
   */
  changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<ChangePasswordResponse> {
    const payload = { currentPassword, newPassword };
    // Ajusta el endpoint '/change-password' según la definición de tu API backend
    return this.http
      .put<ChangePasswordResponse>(
        `${this.baseUrl}/${userId}/change-password`,
        payload
      )
      .pipe(catchError(this.handleError));
  }

  // Manejador de errores básico
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido al procesar la solicitud.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error.
      // El cuerpo de la respuesta puede contener pistas sobre qué salió mal.
      if (error.status === 0) {
        errorMessage =
          'No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.';
      } else if (error.error && error.error.message) {
        errorMessage = `${error.error.message}`; // Mensaje de error específico del backend
      } else {
        errorMessage = `Error del servidor: Código ${error.status}, ${error.message}`;
      }
    }
    console.error('Error en UserService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
