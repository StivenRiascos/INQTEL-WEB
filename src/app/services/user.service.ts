// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/clientes'; // o la URL que uses en backend

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, data: Partial<ClientProfile>): Observable<ClientProfile> {
    return this.http.put<ClientProfile>(`${this.baseUrl}/${id}`, data);
  }
}
