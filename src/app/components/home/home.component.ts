import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgClass, NgIf, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor, NgClass, NgIf, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  plans = [
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
  ];

  constructor() {}

  ngOnInit(): void {}
}
