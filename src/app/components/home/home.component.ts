import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass, NgIf, CurrencyPipe } from '@angular/common';
import { PlanService } from '../../services/plan.service'; // Ajusta la ruta si es diferente
import { Plan } from '../../entities/plan.entity';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgClass, NgIf, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  plans: Plan[] = [];

  constructor(private planService: PlanService) {}

  ngOnInit(): void {
  this.planService.getPlanes().subscribe((planes) => {
    this.plans = planes
      .sort((a, b) => a.id - b.id) // 🔽 Ordenar por ID ascendente
      .map((plan) => {
        switch (plan.id) {
          case 1:
            return {
              ...plan,
              popular: false,
              features: [
                `${plan.nombre} Simétricos`,
                'Fibra óptica hasta tu hogar',
                'Soporte técnico',
                'Instalación gratuita',
              ],
            };
          case 2:
            return {
              ...plan,
              popular: true,
              features: [
                `${plan.nombre} Simétricos`,
                'Fibra óptica hasta tu hogar',
                'Soporte técnico prioritario',
                'Instalación gratuita',
                'Router WiFi incluido',
              ],
            };
          case 3:
            return {
              ...plan,
              popular: false,
              features: [
                `${plan.nombre} Simétricos`,
                'Fibra óptica hasta tu hogar',
                'Soporte técnico 24/7',
                'Instalación gratuita',
                'Router WiFi premium incluido',
                'IP fija opcional',
              ],
            };
          case 4:
            return {
              ...plan,
              popular: false,
              features: [
                `${plan.nombre} Simétricos`,
                'Fibra óptica de alto rendimiento',
                'Atención personalizada',
                'Instalación profesional gratuita',
                'Router avanzado incluido',
                'IP fija',
              ],
            };
          case 5:
            return {
              ...plan,
              popular: false,
              features: [
                `${plan.nombre} Simétricos`,
                'Conectividad empresarial',
                'Soporte dedicado 24/7',
                'Instalación personalizada sin costo',
                'Router premium + backup',
                'IP fija + beneficios empresariales',
              ],
            };
          default:
            return {
              ...plan,
              features: ['Fibra óptica', 'Instalación incluida'],
              popular: false,
            };
        }
      });
  });
}
}