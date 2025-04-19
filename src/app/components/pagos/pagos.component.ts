import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

interface MetodoPago {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  instrucciones: string[];
  cuentas?: {
    tipo: string;
    numero: string;
    titular: string;
    documento?: string;
  }[];
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, NgFor, RouterLink],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent implements OnInit {
  pagoForm: FormGroup;
  busquedaForm: FormGroup;
  metodoSeleccionado: string | null = null;
  formSubmitted = false;
  mostrarModal = false;

  tiposDocumento = [
    { id: 'cedula', nombre: 'Cédula de ciudadanía' },
    { id: 'nit', nombre: 'NIT (Con dígito de verificación)' },
    { id: 'cedulaExt', nombre: 'Cédula de extranjería' },
    { id: 'registroCivil', nombre: 'Registro civil de nacimiento' },
    { id: 'tarjetaId', nombre: 'Tarjeta de identidad' },
    { id: 'pasaporte', nombre: 'Pasaporte' },
    { id: 'tarjetaExt', nombre: 'Tarjeta de extranjería' },
    { id: 'docExt', nombre: 'Documento de identificación extranjero' },
  ];

  metodosPago: MetodoPago[] = [
    {
      id: 'efectivo',
      nombre: 'Efectivo',
      descripcion: 'Pago en nuestras oficinas',
      icono: 'fas fa-money-bill-wave',
      instrucciones: [
        'Visita nuestra oficina en Cll 3 # 9-64, Mocoa, Colombia',
        'Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM, Sábados de 9:00 AM a 1:00 PM',
        'Realiza tu pago en efectivo y recibe tu comprobante de pago',
      ],
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia Bancaria',
      descripcion: 'Transferencia desde tu banco',
      icono: 'fas fa-university',
      instrucciones: [
        'Realiza la transferencia a una de nuestras cuentas bancarias',
        'Envía el comprobante de pago a nuestro WhatsApp: +57 311 2293427',
        'Incluye tu nombre completo y número de contrato en el mensaje',
      ],
      cuentas: [
        {
          tipo: 'Cuenta de Ahorros Bancolombia',
          numero: '91548762345',
          titular: 'INQTEL S.A.S',
          documento: 'NIT: 901.234.567-8',
        },
        {
          tipo: 'Cuenta Corriente Banco de Bogotá',
          numero: '125478963',
          titular: 'INQTEL S.A.S',
          documento: 'NIT: 901.234.567-8',
        },
      ],
    },
    {
      id: 'nequi',
      nombre: 'Nequi',
      descripcion: 'Pago rápido desde tu celular',
      icono: 'fas fa-mobile-alt',
      instrucciones: [
        'Abre tu aplicación Nequi',
        'Selecciona la opción "Enviar"',
        'Envía el pago al número: 311 2293427',
        'Envía el comprobante de pago a nuestro WhatsApp con tu nombre y número de contrato',
      ],
    },
    {
      id: 'daviplata',
      nombre: 'Daviplata',
      descripcion: 'Pago desde tu billetera móvil',
      icono: 'fas fa-wallet',
      instrucciones: [
        'Abre tu aplicación Daviplata',
        'Selecciona la opción "Enviar dinero"',
        'Envía el pago al número: 311 2293427',
        'Envía el comprobante de pago a nuestro WhatsApp con tu nombre y número de contrato',
      ],
    },
  ];

  constructor(private fb: FormBuilder) {
    this.pagoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      contrato: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1)]],
      metodo: ['', [Validators.required]],
      comprobante: ['', [Validators.required]],
    });

    this.busquedaForm = this.fb.group({
      tipoDocumento: ['cedula', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    // Inicializar el componente
  }

  seleccionarMetodo(metodoId: string): void {
    this.metodoSeleccionado = metodoId;
    this.pagoForm.patchValue({
      metodo: metodoId,
    });
  }

  getMetodoActual(): MetodoPago | undefined {
    return this.metodosPago.find(
      (metodo) => metodo.id === this.metodoSeleccionado
    );
  }

  onSubmit(): void {
    if (this.pagoForm.valid) {
      console.log('Formulario enviado:', this.pagoForm.value);
      this.formSubmitted = true;
      // Aquí iría la lógica para procesar el pago
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.pagoForm.controls).forEach((key) => {
        const control = this.pagoForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
    document.body.classList.add('modal-open');
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    document.body.classList.remove('modal-open');
  }

  buscarFactura(): void {
    if (this.busquedaForm.valid) {
      console.log('Buscando factura:', this.busquedaForm.value);
      // Aquí iría la lógica para buscar la factura
      // Por ahora solo cerramos el modal para simular
      // this.cerrarModal();
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.busquedaForm.controls).forEach((key) => {
        const control = this.busquedaForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  get f() {
    return this.pagoForm.controls;
  }

  get b() {
    return this.busquedaForm.controls;
  }
}
