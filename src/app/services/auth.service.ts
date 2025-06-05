import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Cambio aquí
import { Router } from '@angular/router'; // Cambio aquí

export interface User {
  id: number;
  name?: string;
  role: string;
  avatarUrl?: string;

}


interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'currentUser';
 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private https: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
    }
  }

  login(numeroDocumento: string, password: string): Observable<LoginResponse> {
    return this.https
      .post<LoginResponse>('http://localhost:3000/auth/login', {
        numeroDocumento,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
          const user = this.decodeToken(response.access_token);
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        role: payload.rol,
        name: payload.name,
      };
    } catch (error) {
      console.error('Error decodificando token:', error);
      return { id: 0, role: '' };
    }
  }
}
