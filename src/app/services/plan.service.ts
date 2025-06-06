import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../entities/plan.entity'; // Ajusta la ruta si es necesario
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private apiUrl = environment.apiUrl + 'planes';

  constructor(private http: HttpClient) {}

  // Obtener todos los planes con conteo de clientes
  getPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  // Obtener un plan por ID
  getPlanById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo plan
  createPlan(plan: Partial<Plan>): Observable<Plan> {
    return this.http.post<Plan>(this.apiUrl, plan);
  }

  // Actualizar un plan existente
  updatePlan(id: number, plan: Partial<Plan>): Observable<Plan> {
    return this.http.patch<Plan>(`${this.apiUrl}/${id}`, plan);
  }

  // Eliminar un plan
  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
