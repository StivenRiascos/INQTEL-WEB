import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss'],
})
export class ServicesComponent implements OnInit, AfterViewInit {
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

  ngAfterViewInit(): void {
    const canvas = document.getElementById(
      'particles-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    let particles: { x: number; y: number; vx: number; vy: number }[] = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00aaff';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(0,170,255,0.2)';
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}
