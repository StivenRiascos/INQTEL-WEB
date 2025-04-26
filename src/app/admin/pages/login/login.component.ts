import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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
  submitted = false;
  error = '';
  loading = false;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', Validators.required],
      remember: [false],
    });

    // Cargar credenciales guardadas si existen
    this.loadSavedCredentials();
  }

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
    this.error = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.saveCredentials();

    this.authService
      .login(this.f['cedula'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.error =
            'Credenciales incorrectas. Por favor intente nuevamente.';
          console.error('Error de login:', error);
        },
      });
  }
}
