import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass, NgIf, CurrencyPipe } from '@angular/common';

interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
  popular: boolean;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [RouterLink, NgFor, NgClass, NgIf, CurrencyPipe],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [
    {
      id: 1,
      name: '150 Mbps',
      price: 54000,
      features: [
        '150 Mbps Simétricos',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico',
        'Instalación gratuita',
      ],
      popular: false,
    },
    {
      id: 2,
      name: '290 Mbps',
      price: 75000,
      features: [
        '290 Mbps Simétricos',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico prioritario',
        'Instalación gratuita',
        'Router WiFi incluido',
      ],
      popular: true,
    },
    {
      id: 3,
      name: '395 Mbps',
      price: 85000,
      features: [
        '395 Mbps Simétricos',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico 24/7',
        'Instalación gratuita',
        'Router WiFi premium incluido',
        'IP fija opcional',
      ],
      popular: false,
    },
    {
      id: 4,
      name: '490 Mbps',
      price: 99000,
      features: [
        '490 Mbps Simétricos',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico 24/7',
        'Instalación gratuita',
        'Router WiFi premium incluido',
        'IP fija incluida',
        'Atención prioritaria',
      ],
      popular: false,
    },
    {
      id: 5,
      name: '650 Mbps',
      price: 120000,
      features: [
        '650 Mbps Simétricos',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico 24/7',
        'Instalación gratuita',
        'Router WiFi premium incluido',
        'IP fija incluida',
        'Atención VIP',
        'Servicio técnico en menos de 2 horas',
      ],
      popular: false,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
