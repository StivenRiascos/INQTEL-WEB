import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  services: Service[] = [
    {
      id: 1,
      title: 'Internet Residencial',
      description:
        'Conexiones de alta velocidad para tu hogar, perfectas para streaming, juegos y trabajo remoto.',
      icon: 'fas fa-home',
      features: [
        'Velocidades desde 150 Mbps hasta 650 Mbps',
        'Conexión simétrica (misma velocidad de subida y bajada)',
        'Fibra óptica hasta tu hogar',
        'Soporte técnico especializado',
        'Instalación gratuita',
      ],
    },
    {
      id: 2,
      title: 'Internet Empresarial',
      description:
        'Soluciones robustas para empresas con ancho de banda dedicado y soporte prioritario.',
      icon: 'fas fa-building',
      features: [
        'Velocidades personalizadas según necesidades',
        'Conexión simétrica garantizada',
        'IP fija incluida',
        'Soporte técnico prioritario 24/7',
        'Monitoreo constante de la red',
        'Soluciones de respaldo',
      ],
    },
    {
      id: 3,
      title: 'Soporte Técnico',
      description:
        'Asistencia especializada para resolver cualquier problema con tu conexión.',
      icon: 'fas fa-headset',
      features: [
        'Atención telefónica y por WhatsApp',
        'Soporte remoto',
        'Visitas técnicas cuando sea necesario',
        'Mantenimiento preventivo',
        'Asesoría para optimizar tu red WiFi',
      ],
    },
    {
      id: 4,
      title: 'Instalación Profesional',
      description:
        'Instalación de fibra óptica realizada por técnicos especializados.',
      icon: 'fas fa-tools',
      features: [
        'Instalación gratuita',
        'Técnicos certificados',
        'Materiales de alta calidad',
        'Configuración de equipos',
        'Pruebas de velocidad y estabilidad',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
