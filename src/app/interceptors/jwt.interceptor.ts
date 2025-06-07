// src/app/interceptors/jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtiene el token de localStorage
  const token = localStorage.getItem('auth_token');

  // Si el token existe, clona la petición y le añade el encabezado de autorización
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Envía la petición clonada con el token
    return next(cloned);
  }

  // Si no hay token, envía la petición original
  return next(req);
};
