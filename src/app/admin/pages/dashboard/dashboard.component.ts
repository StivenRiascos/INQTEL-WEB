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
import { Chart, registerables, ChartData } from 'chart.js';
import { ClientesService } from '../../../services/client.service';
import { PaymentService } from '../../../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  statsCards = [
    {
      title: 'Total Clientes',
      value: 0,
      icon: 'fas fa-users',
      color: 'primary',
      increase: 12,
      period: 'desde el mes pasado',
    },
    {
      title: 'Ingresos Mensuales',
      value: 0,
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
    /*{
      title: 'Tickets de Soporte',
      value: 18,
      icon: 'fas fa-ticket-alt',
      color: 'warning',
      increase: -5,
      period: 'desde el mes pasado',
    },
    */
  ];

  recentClients: any[] = [];

  // Datos iniciales para los gráficos con estructura válida
  incomeChartData: ChartData<'line'> = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ingresos',
        data: [1200000, 1500000, 1800000, 1300000, 1700000, 1900000],
        borderColor: '#4361ee',
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  plansChartData: ChartData<'doughnut'> = {
    labels: ['Plan Básico', 'Plan Premium', 'Plan Pro'],
    datasets: [
      {
        data: [10, 20, 15],
        backgroundColor: [
          '#4361ee',
          '#4895ef',
          '#4cc9f0',
          '#3f37c9',
          '#7209b7',
          '#b5179e',
        ],
        borderWidth: 1,
      },
    ],
  };

  isMobile = false;
  forceRebuild = false;
  incomeChart: Chart | null = null;
  plansChart: Chart | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimer: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef,
    private clientesService: ClientesService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
  this.checkIfMobile();

  if (typeof ResizeObserver !== 'undefined') {
    this.resizeObserver = new ResizeObserver(this.handleResizeObserver.bind(this));
    this.resizeObserver.observe(document.body);
  } else {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  this.applyLayoutStyles();
  this.loadClientData();

  // Aquí agregas el llamado al ingreso mensual
  this.paymentService.getIngresosMensuales().subscribe({
    next: (total: number) => {
      this.statsCards[1].value = total; // sin el `$` ni `toLocaleString()`

    },
    error: (error) => {
      console.error('Error al obtener ingresos mensuales:', error);
    }
  });
}
ngAfterViewInit(): void {
    this.initCharts();
  }


  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.incomeChart?.destroy();
    this.plansChart?.destroy();
  }

  loadClientData(): void {
  this.clientesService.getClientes().subscribe({
    next: (clientes: any[]) => {
      // Mapear clientes con las propiedades que usabas antes
      const clientesMapeados = clientes.map(client => ({
        ...client,
        name: client.nombre,
        documentType: client.tipoDocumento,
        documentNumber: client.numeroDocumento,
        location: client.direccion,
        phone: client.telefono,
        status: client.estado,
      }));

      // Obtener los 5 clientes más recientes (últimos 5 del array)
      this.recentClients = clientesMapeados.slice(-5).reverse();

      // Actualizar valor total clientes
      this.statsCards[0].value = clientesMapeados.length;

      // Contar clientes por plan para el gráfico
      const planCounts: { [plan: string]: number } = {};
      clientesMapeados.forEach(cliente => {
        const plan = cliente.plan?.nombre || 'Otro';
        planCounts[plan] = (planCounts[plan] || 0) + 1;
      });

      this.plansChartData = {
        labels: Object.keys(planCounts),
        datasets: [
          {
            data: Object.values(planCounts),
            backgroundColor: [
              '#4361ee',
              '#4895ef',
              '#4cc9f0',
              '#3f37c9',
              '#7209b7',
              '#b5179e',
            ],
            borderWidth: 1,
          },
        ],
      };

      if (this.plansChart) {
        this.plansChart.destroy();
        this.createPlansChart();
      }

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error cargando clientes en dashboard:', error);
    }
  });
}


  initCharts(): void {
    setTimeout(() => {
      this.createIncomeChart();
      this.createPlansChart();
    }, 100);
  }

  createIncomeChart(): void {
    const canvas = document.getElementById('incomeChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.incomeChart?.destroy();

    this.incomeChart = new Chart(canvas, {
      type: 'line',
      data: this.incomeChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(value)}`;
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

createPlansChart(): void {
  const canvas = document.getElementById('plansChart') as HTMLCanvasElement;
  if (!canvas) return;

  this.plansChart?.destroy();

  this.plansChart = new Chart(canvas, {
    type: 'doughnut',
    data: this.plansChartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%', // directo en options
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
            label: (context: { label?: string; parsed: number; dataset: { data: any[] } }) => {
              const label = context.label || '';
              const value = context.parsed as number;
              const total = context.dataset.data
                .filter((v): v is number => typeof v === 'number')
                .reduce((a: number, b: number) => a + b, 0);

              const percentage = total
                ? Math.round((value * 100) / total) + '%'
                : '0%';

              return `${label}: ${percentage}`;
            },
          },
        },
      },
    } as any,
  });
}




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

  exportData(): void {
    console.log('Exportando datos...');
    // Implementa aquí la lógica para exportar los datos (CSV, Excel, PDF, etc.)
  }

  private checkIfMobile(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    if (wasMobile && !this.isMobile) {
      this.forceRebuild = true;
      setTimeout(() => {
        this.forceRebuild = false;
        this.cdr.detectChanges();
      }, 100);
    }
  }

  private handleResizeObserver(): void {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.checkIfMobile(), 200);
  }

  private handleResize(): void {
    this.checkIfMobile();
  }

  private applyLayoutStyles(): void {
    this.renderer.addClass(this.el.nativeElement, 'dashboard-component');
  }
}
