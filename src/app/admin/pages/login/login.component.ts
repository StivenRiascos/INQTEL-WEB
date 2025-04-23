import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '/admin';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirigir al dashboard si ya está logueado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required],
      remember: [false],
    });

    // Obtener la URL de retorno de los query params o usar el valor predeterminado
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';

    // Cargar credenciales guardadas si existen
    this.loadSavedCredentials();
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loadSavedCredentials(): void {
    const savedCedula = localStorage.getItem('savedCedula');
    if (savedCedula) {
      this.loginForm.patchValue({
        cedula: savedCedula,
        remember: true,
      });
    }
  }

  saveCredentials(): void {
    if (this.f['remember'].value) {
      localStorage.setItem('savedCedula', this.f['cedula'].value);
    } else {
      localStorage.removeItem('savedCedula');
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Guardar credenciales si se seleccionó "recordar"
    this.saveCredentials();

    this.authService
      .login(this.f['cedula'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error: any) => {
          this.error = 'Credenciales incorrectas';
          this.loading = false;
        },
      });
  }
}
