import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Datos del perfil
  profile = {
    fullName: 'John Doe',
    email: 'john.doe@inqtel.com',
    phone: '+1 (555) 123-4567',
    position: 'Administrador',
    bio: 'Administrador del sistema con experiencia en gestión de plataformas tecnológicas y atención al cliente.',
    role: 'Administrador',
    avatarUrl: 'assets/images/user-avatar.jpg',
    preferences: {
      language: 'es',
      timezone: 'America/Bogota',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      notifications: {
        email: true,
        browser: true,
        system: true,
        marketing: false,
      },
    },
  };

  // Cambio de contraseña
  passwordChange = {
    current: '',
    new: '',
    confirm: '',
  };

  // Fortaleza de la contraseña
  passwordStrength = {
    percentage: 0,
    class: '',
    text: '',
  };


  // Datos para selects
  timezones = [
    { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  ];

  // Control de modales
  showConfirmModal: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Inicializar componente
    this.updatePasswordStrength();
  }

  // Métodos para manejo de la foto de perfil
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Crear una URL para previsualizar la imagen
      this.profile.avatarUrl = URL.createObjectURL(file);

      // Aquí se podría implementar la lógica para subir el archivo al servidor
      console.log('Archivo seleccionado:', file.name);
    }
  }

  // Métodos para manejo de contraseñas
  updatePasswordStrength(): void {
    const password = this.passwordChange.new;

    if (!password) {
      this.passwordStrength = {
        percentage: 0,
        class: '',
        text: '',
      };
      return;
    }

    // Criterios de fortaleza
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    // Calcular puntuación
    let score = 0;
    if (hasLowerCase) score += 1;
    if (hasUpperCase) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;
    if (isLongEnough) score += 1;

    // Determinar fortaleza
    const percentage = (score / 5) * 100;
    let strengthClass = '';
    let strengthText = '';

    if (percentage < 40) {
      strengthClass = 'weak';
      strengthText = 'Débil';
    } else if (percentage < 80) {
      strengthClass = 'medium';
      strengthText = 'Media';
    } else {
      strengthClass = 'strong';
      strengthText = 'Fuerte';
    }

    this.passwordStrength = {
      percentage,
      class: strengthClass,
      text: strengthText,
    };
  }

  canChangePassword(): boolean {
    return (
      !!this.passwordChange.current &&
      !!this.passwordChange.new &&
      this.passwordChange.new === this.passwordChange.confirm &&
      this.passwordStrength.percentage >= 40
    );
  }

  changePassword(): void {
    if (!this.canChangePassword()) return;

    // Aquí iría la lógica para cambiar la contraseña
    console.log('Cambiando contraseña...');

    // Simular éxito
    alert('Contraseña cambiada correctamente');

    // Limpiar campos
    this.passwordChange = {
      current: '',
      new: '',
      confirm: '',
    };

    // Actualizar fortaleza
    this.updatePasswordStrength();

  }


  // Métodos para guardar perfil
  saveProfile(): void {
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmSaveProfile(): void {
    // Aquí iría la lógica para guardar el perfil
    console.log('Guardando perfil:', this.profile);

    // Cerrar modal
    this.closeConfirmModal();

    // Simular éxito
    alert('Perfil actualizado correctamente');

  }
}
