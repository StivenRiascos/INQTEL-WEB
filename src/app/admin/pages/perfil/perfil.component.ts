import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import {
  UserService,
  ClientProfile,
  ChangePasswordResponse,
} from '../../../services/user.service'; // Importar ChangePasswordResponse

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profile: ClientProfile = {
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    rol: '',
    avatarUrl: 'assets/images/user-avatar.jpg',
  };

  passwordChange = {
    current: '',
    new: '',
    confirm: '',
  };

  passwordStrength = {
    percentage: 0,
    class: '',
    text: '',
  };

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser: User | null = this.authService.currentUserValue;
    if (currentUser) {
      this.loadUserProfile(currentUser.id);
    }
    this.updatePasswordStrength();
  }

  loadUserProfile(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.profile = {
          ...data,
          avatarUrl: data.avatarUrl || 'assets/images/user-avatar.jpg',
        };
      },
      error: (err) => {
        console.error('Error cargando perfil:', err.message || err);
        alert(
          `Error al cargar el perfil: ${
            err.message || 'Consulte la consola para más detalles.'
          }`
        );
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.avatarUrl = e.target.result;
        console.log('Avatar seleccionado (localmente):', file.name);
        // Aquí se necesitaría una lógica para subir y persistir el avatar si se desea
        // this.userService.updateUser(this.profile.id, { avatarUrl: this.profile.avatarUrl }).subscribe(...);
        alert(
          'Avatar cambiado localmente. La persistencia en el servidor requerirá implementación adicional.'
        );
      };
      reader.readAsDataURL(file);
    }
  }

  updatePasswordStrength(): void {
    const password = this.passwordChange.new;
    if (!password) {
      this.passwordStrength = { percentage: 0, class: '', text: '' };
      return;
    }
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    let score = 0;
    if (hasLowerCase) score++;
    if (hasUpperCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    if (isLongEnough) score++;
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
      this.passwordStrength.percentage >= 40 // O un umbral que consideres adecuado
    );
  }

  changePassword(): void {
    if (!this.canChangePassword()) {
      alert(
        'Por favor, asegúrate de que la contraseña actual esté ingresada, la nueva contraseña cumpla los requisitos y las confirmaciones coincidan.'
      );
      return;
    }

    if (!this.profile || this.profile.id === 0) {
      alert(
        'Error: No se pudo identificar al usuario. Por favor, recargue la página.'
      );
      return;
    }

    this.userService
      .changePassword(
        this.profile.id,
        this.passwordChange.current,
        this.passwordChange.new
      )
      .subscribe({
        next: (response: ChangePasswordResponse) => {
          alert(response.message || 'Contraseña cambiada exitosamente.');
          this.passwordChange = { current: '', new: '', confirm: '' };
          this.updatePasswordStrength();
        },
        error: (err: Error) => {
          // El error ya viene como objeto Error desde el servicio
          console.error('Error al cambiar la contraseña:', err);
          alert(`Error al cambiar la contraseña: ${err.message}`);
        },
      });
  }
}
