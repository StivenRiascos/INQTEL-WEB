import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;
  mostrarModalLogin = false;
  mostrarPassword = false;
  isLoading = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required]],
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Métodos para el modal de login
  abrirModalLogin() {
    this.mostrarModalLogin = true;
    this.loginForm.reset();
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  cerrarModalLogin() {
    this.mostrarModalLogin = false;
    document.body.style.overflow = ''; // Restaurar scroll del body
  }

  togglePasswordVisibility() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      // Aquí iría la lógica para autenticar al usuario
      // Por ejemplo, un servicio que haga la petición al backend

      // Simulamos una petición
      setTimeout(() => {
        this.isLoading = false;
        // Redirigir al panel administrativo si la autenticación es exitosa
        // this.router.navigate(['/admin']);
        this.cerrarModalLogin();
        console.log('Inicio de sesión con:', this.loginForm.value);
      }, 1500);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
