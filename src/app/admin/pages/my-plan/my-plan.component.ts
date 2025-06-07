// src/app/admin/pages/my-plan/my-plan.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, ClientProfile } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Plan } from '../../../entities/plan.entity';

@Component({
  selector: 'app-my-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.scss'],
})
export class MyPlanComponent implements OnInit {
  userProfile: ClientProfile | null = null;
  currentPlan: Plan | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userService.getUserById(currentUser.id).subscribe({
        next: (data) => {
          this.userProfile = data;
          this.currentPlan = data.plan;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.error = 'No se pudo cargar la información de tu plan.';
          this.isLoading = false;
        },
      });
    } else {
      this.error = 'No se pudo identificar al usuario.';
      this.isLoading = false;
    }
  }
}
