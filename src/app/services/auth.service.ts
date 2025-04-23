import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  private tokenKey = 'auth_token';
  private userKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Simula login sin backend
  login(cedula: string, password: string): Observable<User> {
    const mockUser: User = {
      id: 1,
      name: 'Administrador de Prueba',
      role: 'admin',
    };

    return of(mockUser).pipe(
      delay(500), // Simula un pequeño retraso de red
      tap((user) => {
        localStorage.setItem(this.tokenKey, 'fake-jwt-token');
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
