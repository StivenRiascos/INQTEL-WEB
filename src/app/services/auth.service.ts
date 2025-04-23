import { Injectable } from '@angular/core';
import { BehaviorSubject, type Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si hay un usuario en localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(cedula: string, password: string): Observable<User> {
    // Simulación de autenticación - En producción, esto sería una llamada a la API
    return of({
      id: 1,
      name: 'Administrador',
      role: 'admin',
    }).pipe(
      delay(1000), // Simular retraso de red
      tap((user) => {
        // Guardar usuario en localStorage y actualizar el BehaviorSubject
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    // Eliminar usuario de localStorage y actualizar el BehaviorSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
