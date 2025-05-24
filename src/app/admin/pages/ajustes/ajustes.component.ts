import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../services/plan.service';
import { Plan } from '../../../entities/plan.entity';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AjustesComponent implements OnInit {
  // Control de pestañas
  activeTab: string = 'general';

  // Configuraciones generales
  settings = {
    general: {
      companyName: 'INQTEL',
      contactEmail: 'contacto@inqtel.com',
      phoneNumber: '+1 (555) 123-4567',
      address: 'Calle Principal #123, Ciudad',
      timezone: 'America/Bogota',
      dateFormat: 'DD/MM/YYYY',
      logo: '',
    },
    security: {
      passwordPolicy: 'medium',
      sessionTimeout: '30',
      twoFactorAuth: false,
      limitLoginAttempts: true,
      maxLoginAttempts: 5,
      lockoutTime: 15,
      logUserActivity: true,
      logRetentionDays: 30,
    },
    notifications: {
      email: {
        newClient: true,
        payment: true,
        expiredPlan: true,
        systemAlert: false,
      },
      templates: {
        welcome:
          'Estimado {nombre},\n\nBienvenido a INQTEL. Su plan {plan} ha sido activado y estará disponible hasta {fecha_expiracion}.\n\nSaludos cordiales,\nEquipo INQTEL',
        payment:
          'Estimado {nombre},\n\nConfirmamos el pago de {monto} realizado el {fecha} para el plan {plan}.\n\nGracias por su preferencia,\nEquipo INQTEL',
      },
    },
  };

  // Datos para selects
  timezones = [
    { value: 'America/Bogota', label: 'Bogotá (GMT-5)' },
    { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
    { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  ];

  // Usuarios
  users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@inqtel.com',
      role: 'Administrador',
      status: 'Activo',
      lastLogin: '15/05/2023 10:30',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@inqtel.com',
      role: 'Operador',
      status: 'Activo',
      lastLogin: '14/05/2023 15:45',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@inqtel.com',
      role: 'Soporte',
      status: 'Inactivo',
      lastLogin: '10/05/2023 09:15',
    },
    {
      id: 4,
      name: 'Maria García',
      email: 'maria.g@inqtel.com',
      role: 'Visualizador',
      status: 'Bloqueado',
      lastLogin: '01/05/2023 11:20',
    },
  ];


  // Control de modales
  showUserModal: boolean = false;
  showPlanModal: boolean = false;
  showDeleteModal: boolean = false;
  showResetPasswordModal: boolean = false;

  // Datos para edición
  isEditingUser: boolean = false;
  isEditingPlan: boolean = false;
  currentUser: any = {};
  currentPlan: any = {};
  deleteType: string = '';
  deleteItemId: number = 0;
  deleteItemName: string = '';
  resetPasswordUserId: number = 0;
  resetPasswordUserName: string = '';
  newPassword: string = '';

  // Logo preview
  logoPreview: string | null = null;

  plans: Plan[] = [];

  constructor(private planService: PlanService) {}

  

  ngOnInit(): void {
  this.cargarPlanes();
}

cargarPlanes(): void {
  this.planService.getPlanes().subscribe({
    next: (planes) => {
      this.plans = planes.sort((a, b) => a.id - b.id);
      console.log('Planes cargados:', this.plans); // opcional para debug
    },
    error: (error) => {
      console.error('Error al cargar los planes:', error);
    }
  });
}


  // Métodos para control de pestañas
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Métodos para guardar configuraciones
  saveAllSettings(): void {
    // Aquí iría la lógica para guardar todas las configuraciones
    console.log('Guardando configuraciones:', this.settings);
    alert('Configuraciones guardadas correctamente');
  }

  // Métodos para manejo de usuarios
  openNewUserModal(): void {
    this.isEditingUser = false;
    this.currentUser = {
      name: '',
      email: '',
      role: 'Operador',
      status: 'Activo',
      password: '',
    };
    this.showUserModal = true;
  }

  editUser(user: any): void {
    this.isEditingUser = true;
    this.currentUser = { ...user };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  saveUser(): void {
    if (this.isEditingUser) {
      // Actualizar usuario existente
      const index = this.users.findIndex((u) => u.id === this.currentUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.currentUser };
      }
    } else {
      // Crear nuevo usuario
      const newId = Math.max(...this.users.map((u) => u.id)) + 1;
      this.users.push({
        id: newId,
        name: this.currentUser.name,
        email: this.currentUser.email,
        role: this.currentUser.role,
        status: this.currentUser.status,
        lastLogin: 'Nunca',
      });
    }
    this.closeUserModal();
  }

  deleteUser(user: any): void {
    this.deleteType = 'user';
    this.deleteItemId = user.id;
    this.deleteItemName = user.name;
    this.showDeleteModal = true;
  }

  resetPassword(user: any): void {
    this.resetPasswordUserId = user.id;
    this.resetPasswordUserName = user.name;
    this.newPassword = '';
    this.showResetPasswordModal = true;
  }

  closeResetPasswordModal(): void {
    this.showResetPasswordModal = false;
  }

  confirmResetPassword(): void {
    // Aquí iría la lógica para resetear la contraseña
    console.log(
      `Reseteando contraseña para usuario ID ${this.resetPasswordUserId} a: ${this.newPassword}`
    );
    alert(
      `Contraseña reseteada correctamente para ${this.resetPasswordUserName}`
    );
    this.closeResetPasswordModal();
  }

  // Métodos para manejo de planes
  openNewPlanModal(): void {
    this.isEditingPlan = false;
    this.currentPlan = {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      status: 'Activo',
    };
    this.showPlanModal = true;
  }

  editPlan(plan: any): void {
    this.isEditingPlan = true;
    this.currentPlan = { ...plan };
    this.showPlanModal = true;
  }

  closePlanModal(): void {
    this.showPlanModal = false;
  }

  savePlan(): void {
    if (this.isEditingPlan) {
      // Actualizar plan existente
      const index = this.plans.findIndex((p) => p.id === this.currentPlan.id);
      if (index !== -1) {
        this.plans[index] = { ...this.currentPlan };
      }
    } else {
      // Crear nuevo plan
      const newId = Math.max(...this.plans.map((p) => p.id)) + 1;
      this.plans.push({
        id: newId,
        nombre: this.currentPlan.name,
        descripcion: this.currentPlan.description,
        precio: this.currentPlan.price,
        clientCount: 0,
      });
    }
    this.closePlanModal();
  }

  deletePlan(plan: any): void {
    this.deleteType = 'plan';
    this.deleteItemId = plan.id;
    this.deleteItemName = plan.name;
    this.showDeleteModal = true;
  }

  // Métodos para manejo del modal de eliminación
  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.deleteType === 'user') {
      // Eliminar usuario
      this.users = this.users.filter((u) => u.id !== this.deleteItemId);
    } else if (this.deleteType === 'plan') {
      // Eliminar plan
      this.plans = this.plans.filter((p) => p.id !== this.deleteItemId);
    }
    this.closeDeleteModal();
  }

  // Métodos para manejo de clases CSS
  getUserStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'badge status-active';
      case 'Inactivo':
        return 'badge status-inactive';
      case 'Bloqueado':
        return 'badge status-blocked';
      default:
        return 'badge';
    }
  }

  getPlanStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'badge status-active';
      case 'Inactivo':
        return 'badge status-inactive';
      default:
        return 'badge';
    }
  }

  // Método para manejar cambio de logo
  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Crear una URL para previsualizar la imagen
      this.logoPreview = URL.createObjectURL(file);

      // Aquí se podría implementar la lógica para subir el archivo al servidor
      console.log('Archivo seleccionado:', file.name);
    }
  }
}
