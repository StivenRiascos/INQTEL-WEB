// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Primero, verificamos si el usuario está logueado y si es admin.
    if (
      this.authService.isLoggedIn() &&
      this.authService.currentUserValue?.role === 'admin'
    ) {
      return true;
    }

    // Si no es admin, lo redirigimos a su perfil y bloqueamos el acceso.
    this.router.navigate(['/admin/perfil']);
    return false;
  }
}
