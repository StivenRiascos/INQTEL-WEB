import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Renderer2,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  // Datos de ejemplo para las tarjetas de estadísticas
  statsCards = [
    {
      title: 'Total Clientes',
      value: 256,
      icon: 'fas fa-users',
      color: 'primary',
      increase: 12,
      period: 'desde el mes pasado',
    },
    {
      title: 'Ingresos Mensuales',
      value: '$12,580,000',
      icon: 'fas fa-dollar-sign',
      color: 'success',
      increase: 8,
      period: 'desde el mes pasado',
    },
    {
      title: 'Nuevos Clientes',
      value: 24,
      icon: 'fas fa-user-plus',
      color: 'info',
      increase: 15,
      period: 'este mes',
    },
    {
      title: 'Tickets de Soporte',
      value: 18,
      icon: 'fas fa-ticket-alt',
      color: 'warning',
      increase: -5,
      period: 'desde el mes pasado',
    },
  ];

  // Datos de ejemplo para la tabla de clientes recientes
  recentClients = [
    {
      id: 1,
      name: 'Juan Pérez',
      plan: 'Plan 250 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-15',
      amount: '$75,000',
    },
    {
      id: 2,
      name: 'María López',
      plan: 'Plan 150 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-12',
      amount: '$54,000',
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      plan: 'Plan 490 Mbps',
      status: 'Pendiente',
      lastPayment: '2023-03-28',
      amount: '$99,000',
    },
    {
      id: 4,
      name: 'Ana Martínez',
      plan: 'Plan 395 Mbps',
      status: 'Activo',
      lastPayment: '2023-04-10',
      amount: '$85,000',
    },
    {
      id: 5,
      name: 'Pedro Sánchez',
      plan: 'Plan 650 Mbps',
      status: 'Inactivo',
      lastPayment: '2023-03-15',
      amount: '$120,000',
    },
  ];

  // Datos para los gráficos
  incomeChartData = {
    labels: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],
    datasets: [
      {
        label: 'Ingresos 2023',
        data: [
          9500000, 10200000, 11000000, 10800000, 11500000, 12000000, 12300000,
          12580000, 13000000, 13200000, 13500000, 14000000,
        ],
        borderColor: '#4895ef',
        backgroundColor: 'rgba(72, 149, 239, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  plansChartData = {
    labels: [
      'Plan 150 Mbps',
      'Plan 250 Mbps',
      'Plan 395 Mbps',
      'Plan 490 Mbps',
      'Plan 650 Mbps',
    ],
    datasets: [
      {
        data: [35, 45, 15, 25, 10],
        backgroundColor: [
          '#4361ee',
          '#4895ef',
          '#4cc9f0',
          '#3f37c9',
          '#7209b7',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Variable para controlar si estamos en modo móvil
  isMobile = false;

  // Variable para forzar reconstrucción del DOM
  forceRebuild = false;

  // Referencias a los gráficos
  incomeChart: Chart | null = null;
  plansChart: Chart | null = null;

  // Referencia al ResizeObserver
  private resizeObserver: ResizeObserver | null = null;

  // Referencia al timer para debounce
  private resizeTimer: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Detectar si estamos en modo móvil al iniciar
    this.checkIfMobile();

    // Usar ResizeObserver para un mejor rendimiento
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(
        this.handleResizeObserver.bind(this)
      );
      this.resizeObserver.observe(document.body);
    } else {
      // Fallback para navegadores que no soportan ResizeObserver
      window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Aplicar estilos iniciales
    this.applyLayoutStyles();
  }

  ngAfterViewInit(): void {
    // Inicializar los gráficos después de que la vista esté lista
    this.initCharts();
  }

  ngOnDestroy(): void {
    // Limpiar los listeners al destruir el componente
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Limpiar el timer si existe
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    // Destruir los gráficos si existen
    if (this.incomeChart) {
      this.incomeChart.destroy();
    }
    if (this.plansChart) {
      this.plansChart.destroy();
    }
  }

  // Inicializar los gráficos
  initCharts(): void {
    setTimeout(() => {
      this.createIncomeChart();
      this.createPlansChart();
    }, 100);
  }

  // Crear el gráfico de ingresos
  createIncomeChart(): void {
    const incomeCanvas = document.getElementById(
      'incomeChart'
    ) as HTMLCanvasElement;
    if (!incomeCanvas) return;

    if (this.incomeChart) {
      this.incomeChart.destroy();
    }

    this.incomeChart = new Chart(incomeCanvas, {
      type: 'line',
      data: this.incomeChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) =>
                new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  notation: 'compact',
                  maximumFractionDigits: 0,
                }).format(value as number),
            },
          },
        },
      },
    });
  }

  // Crear el gráfico de distribución de planes
  createPlansChart(): void {
    const plansCanvas = document.getElementById(
      'plansChart'
    ) as HTMLCanvasElement;
    if (!plansCanvas) return;

    if (this.plansChart) {
      this.plansChart.destroy();
    }

    this.plansChart = new Chart(plansCanvas, {
      type: 'doughnut',
      data: this.plansChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 12,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = Math.round((value * 100) / total) + '%';
                return `${label}: ${percentage}`;
              },
            },
          },
        },
        cutout: '70%',
      },
    });
  }

  // Método para determinar la clase CSS según el estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'Activo':
        return 'badge-success';
      case 'Pendiente':
        return 'badge-warning';
      case 'Inactivo':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  // Método para exportar datos
  exportData(): void {
    console.log('Exportando datos...');
    // Implementación básica de exportación
  }

  // Método para verificar si estamos en modo móvil
  private checkIfMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // Si cambiamos de móvil a escritorio, forzamos reconstrucción
    if (wasMobile && !this.isMobile) {
      this.forceRebuild = true;

      // Forzar reconstrucción después de un pequeño retraso
      setTimeout(() => {
        this.forceRebuild = false;
        this.cdr.detectChanges();

        // Aplicar estilos después de la reconstrucción
        setTimeout(() => {
          this.applyLayoutStyles();
          // Reinicializar los gráficos después de reconstruir el DOM
          this.initCharts();
        }, 50);
      }, 50);
    }
  }

  // Método para aplicar estilos de layout
  private applyLayoutStyles(): void {
    if (!this.isMobile) {
      // Obtener todos los elementos de columna
      const statsCards = this.el.nativeElement.querySelectorAll(
        '.stats-cards .col-md-3'
      );
      const contentCols8 = this.el.nativeElement.querySelectorAll(
        '.dashboard-content .col-lg-8'
      );
      const contentCols4 = this.el.nativeElement.querySelectorAll(
        '.dashboard-content .col-lg-4'
      );

      // Aplicar estilos a las tarjetas de estadísticas
      statsCards.forEach((col: HTMLElement) => {
        this.renderer.setStyle(col, 'width', '25%');
        this.renderer.setStyle(col, 'flex', '0 0 25%');
        this.renderer.setStyle(col, 'max-width', '25%');
      });

      // Aplicar estilos a las columnas de contenido
      contentCols8.forEach((col: HTMLElement) => {
        this.renderer.setStyle(col, 'width', '66.666667%');
        this.renderer.setStyle(col, 'flex', '0 0 66.666667%');
        this.renderer.setStyle(col, 'max-width', '66.666667%');
      });

      contentCols4.forEach((col: HTMLElement) => {
        this.renderer.setStyle(col, 'width', '33.333333%');
        this.renderer.setStyle(col, 'flex', '0 0 33.333333%');
        this.renderer.setStyle(col, 'max-width', '33.333333%');
      });
    }
  }

  // Manejador para ResizeObserver con debounce
  private handleResizeObserver(entries: ResizeObserverEntry[]): void {
    // Usar debounce para evitar múltiples actualizaciones
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.checkIfMobile();
    }, 150);
  }

  // Manejador de evento resize (fallback) con debounce
  private handleResize(): void {
    // Usar debounce para evitar múltiples actualizaciones
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.checkIfMobile();
    }, 150);
  }
}
