import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../../services/auth.service';
import { UserService, ClientProfile } from '../../../services/user.service';

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
    // añade aquí otras propiedades que necesites
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

  showConfirmModal: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    const currentUser: User | null = this.authService.currentUserValue;
    if (currentUser) {
      this.loadUserProfile(currentUser.id);
    }
    this.updatePasswordStrength();
  }

  loadUserProfile(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.profile = {
          ...data,
          avatarUrl: 'assets/images/user-avatar.jpg', // imagen estática fija, o ajusta si quieres
        };
      },
      error: (err) => {
        console.error('Error cargando perfil:', err);
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profile.avatarUrl = URL.createObjectURL(file);
      console.log('Archivo seleccionado:', file.name);
      // Aquí puedes implementar subida al servidor si quieres luego
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

    this.passwordStrength = { percentage, class: strengthClass, text: strengthText };
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

    console.log('Cambiando contraseña...');
    alert('Contraseña cambiada correctamente');

    this.passwordChange = { current: '', new: '', confirm: '' };
    this.updatePasswordStrength();
  }

  saveProfile(): void {
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmSaveProfile(): void {
    this.userService.updateUser(this.profile.id, this.profile).subscribe({
      next: () => {
        alert('Perfil actualizado correctamente');
        this.closeConfirmModal();
      },
      error: (err) => {
        console.error('Error guardando perfil:', err);
        alert('Error al guardar perfil');
      },
    });
  }
}
