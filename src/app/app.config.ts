import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 1. Importa las nuevas funciones de HttpClient y nuestro interceptor
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor'; // Asegúrate de que el archivo del interceptor esté en la ruta correcta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // Mantenemos los módulos de formularios
    importProvidersFrom(FormsModule, ReactiveFormsModule),

    // 2. Reemplazamos el antiguo HttpClientModule por el nuevo proveedor
    // que incluye nuestro interceptor para añadir el token a las peticiones.
    provideHttpClient(withInterceptors([jwtInterceptor])),
  ],
};
