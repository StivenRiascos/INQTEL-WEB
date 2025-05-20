import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../entities/plan.entity'; // ajusta la ruta si es diferente

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = 'http://localhost:3000/planes'; // cambia si usas otro puerto o dominio

  constructor(private http: HttpClient) {}

  getPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }
}
