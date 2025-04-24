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

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
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
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.saveCredentials();

    this.authService
      .login(this.f['cedula'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: () => {
          this.error = 'Credenciales incorrectas o error de conexión';
          this.loading = false;
        },
      });
  }
}
