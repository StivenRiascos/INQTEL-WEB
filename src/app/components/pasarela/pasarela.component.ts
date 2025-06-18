import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { PaymentService } from '../../services/payment.service';

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PasarelaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Información del cliente (se llenará desde la factura)
  customerName: string = '';
  customerID: string = '';
  customerPhone: string = '';
  customerEmail: string = '';

  // Información del pago (se llenará desde la factura)
  paymentConcept: string = '';
  invoiceNumber: string = '';
  totalAmount: number = 0;
  taxes: number = 0;
  subtotal: number = 0;
  facturaId: number | null = null;

  // Estado del formulario
  selectedPaymentMethod: 'pse' | 'card' | null = null;
  acceptTerms: boolean = false;
  personType: 'natural' | 'juridica' = 'natural';
  selectedBank: string = '';
  isProcessing: boolean = false;
  loadingMessage: string = 'Procesando pago...';

  // Detalles de la tarjeta
  cardDetails: CardDetails = { number: '', expiry: '', cvv: '', name: '' };

  // Validación
  validationErrors: { [key: string]: string } = {};
  touched: { [key: string]: boolean } = {};

  // Constantes
  readonly MIN_CARD_NUMBER_LENGTH = 13;
  readonly MAX_CARD_NUMBER_LENGTH = 19;
  readonly CVV_LENGTH = 3;
  readonly AMEX_CVV_LENGTH = 4;

  banks: Bank[] = [
    { id: '1007', name: 'Bancolombia', code: 'BANCOLOMBIA' },
    { id: '1001', name: 'Banco de Bogotá', code: 'BANCO_BOGOTA' },
    { id: '1023', name: 'Davivienda', code: 'DAVIVIENDA' },
    { id: '1013', name: 'BBVA', code: 'BBVA' },
  ];

  constructor(private router: Router, private paymentService: PaymentService) {}

  ngOnInit(): void {
    // 🚀 ================== INICIO DEL CAMBIO ================== 🚀
    // Leemos el 'state' directamente del historial del navegador.
    // Esta es una forma más robusta y segura de asegurar que los datos lleguen.
    const state = history.state;

    if (state && state.factura) {
      const factura = state.factura;
      this.facturaId = factura.id;
      this.customerName = factura.nombre;
      this.customerID = factura.numeroDocumento || 'No proporcionado';
      this.customerEmail = factura.email || 'No proporcionado';
      this.customerPhone = factura.telefono || 'No proporcionado';
      this.paymentConcept = factura.plan || 'Plan de Internet';
      this.invoiceNumber = factura.id.toString();
      this.totalAmount = parseFloat(factura.precio);
      this.calculateAmounts();
    } else {
      // Si no hay datos, redirigimos como medida de seguridad.
      console.warn(
        'No hay datos de factura en history.state, redirigiendo a /pagos'
      );
      this.router.navigate(['/pagos']);
    }
    // 🚀 =================== FIN DEL CAMBIO ==================== 🚀
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateAmounts(): void {
    this.taxes = 0.0;
    this.subtotal = this.totalAmount;
  }

  // --- MÉTODOS DE PROCESAMIENTO DE PAGO ---

  private processPayment(): void {
    if (!this.facturaId) {
      alert('Error: No se ha identificado la factura a pagar.');
      return;
    }

    this.isProcessing = true;
    this.loadingMessage = 'Procesando pago, por favor espere...';
    this.clearValidationErrors();

    const pagoData = {
      facturaId: this.facturaId,
      monto: this.totalAmount,
      fechaPago: new Date().toISOString().split('T')[0],
    };

    this.paymentService
      .realizarPago(pagoData)
      .pipe(
        finalize(() => {
          this.isProcessing = false;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          console.log('Pago exitoso:', response);
          alert(response.message || '¡Su pago ha sido procesado con éxito!');
          this.router.navigate(['/admin/mis-facturas']);
        },
        error: (error) => {
          this.handlePaymentError(error);
        },
      });
  }

  processPSEPayment(): void {
    if (!this.canProceedPSE()) {
      this.showValidationErrors();
      return;
    }
    this.processPayment();
  }

  processCardPayment(): void {
    if (!this.canProceedCard()) {
      this.showValidationErrors();
      return;
    }
    this.processPayment();
  }

  private handlePaymentError(error: any): void {
    console.error('Error procesando el pago:', error);
    alert(
      'Hubo un problema al procesar su pago. Por favor, inténtelo de nuevo más tarde o contacte a soporte.'
    );
  }

  // --- El resto de los métodos de validación y formato se mantienen igual ---
  selectPaymentMethod(method: 'pse' | 'card'): void {
    this.selectedPaymentMethod = method;
    this.clearValidationErrors();
    if (method === 'pse') {
      this.resetCardForm();
    } else {
      this.selectedBank = '';
    }
    this.validateForm();
  }
  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (
      cleanNumber.length < this.MIN_CARD_NUMBER_LENGTH ||
      cleanNumber.length > this.MAX_CARD_NUMBER_LENGTH
    )
      return false;
    return this.luhnCheck(cleanNumber);
  }
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }
  validateExpiry(expiry: string): boolean {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    return (
      expYear > currentYear ||
      (expYear === currentYear && expMonth >= currentMonth)
    );
  }
  validateCVV(cvv: string, cardNumber: string): boolean {
    const isAmex = this.isAmexCard();
    const expectedLength = isAmex ? this.AMEX_CVV_LENGTH : this.CVV_LENGTH;
    return cvv.length === expectedLength && /^\d+$/.test(cvv);
  }
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 23) {
      formattedValue = formattedValue.substring(0, 23);
    }
    this.cardDetails.number = formattedValue;
    this.validateForm();
  }
  formatExpiry(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardDetails.expiry = value;
    this.validateForm();
  }
  formatCVV(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    const maxLength = this.isAmexCard()
      ? this.AMEX_CVV_LENGTH
      : this.CVV_LENGTH;
    this.cardDetails.cvv = value.substring(0, maxLength);
    this.validateForm();
  }
  isAmexCard(): boolean {
    const cleanNumber = this.cardDetails.number.replace(/\s/g, '');
    return cleanNumber.startsWith('34') || cleanNumber.startsWith('37');
  }
  validateField(fieldName: string): void {
    this.touched[fieldName] = true;
    delete this.validationErrors[fieldName];
    switch (fieldName) {
      case 'cardNumber':
        if (!this.validateCardNumber(this.cardDetails.number)) {
          this.validationErrors[fieldName] = 'Número de tarjeta inválido';
        }
        break;
      case 'expiry':
        if (!this.validateExpiry(this.cardDetails.expiry)) {
          this.validationErrors[fieldName] = 'Fecha de vencimiento inválida';
        }
        break;
      case 'cvv':
        if (!this.validateCVV(this.cardDetails.cvv, this.cardDetails.number)) {
          this.validationErrors[fieldName] = 'CVV inválido';
        }
        break;
      case 'cardName':
        if (this.cardDetails.name.trim().length < 2) {
          this.validationErrors[fieldName] = 'Nombre del titular requerido';
        }
        break;
      case 'bank':
        if (!this.selectedBank) {
          this.validationErrors[fieldName] = 'Seleccione un banco';
        }
        break;
    }
  }
  validateForm(): void {
    if (this.selectedPaymentMethod === 'card') {
      this.validateField('cardNumber');
      this.validateField('expiry');
      this.validateField('cvv');
      this.validateField('cardName');
    } else if (this.selectedPaymentMethod === 'pse') {
      this.validateField('bank');
    }
  }
  canProceedPSE(): boolean {
    return (
      this.acceptTerms &&
      this.selectedBank !== '' &&
      !this.isProcessing &&
      this.selectedPaymentMethod === 'pse'
    );
  }
  canProceedCard(): boolean {
    const cardValid =
      this.validateCardNumber(this.cardDetails.number) &&
      this.validateExpiry(this.cardDetails.expiry) &&
      this.validateCVV(this.cardDetails.cvv, this.cardDetails.number) &&
      this.cardDetails.name.trim().length > 0;
    return (
      this.acceptTerms &&
      cardValid &&
      !this.isProcessing &&
      this.selectedPaymentMethod === 'card'
    );
  }
  private showValidationErrors(): void {
    if (this.selectedPaymentMethod === 'card') {
      this.validateField('cardNumber');
      this.validateField('expiry');
      this.validateField('cvv');
      this.validateField('cardName');
    } else if (this.selectedPaymentMethod === 'pse') {
      this.validateField('bank');
    }
  }
  private clearValidationErrors(): void {
    this.validationErrors = {};
  }
  private resetCardForm(): void {
    this.cardDetails = { number: '', expiry: '', cvv: '', name: '' };
    this.clearValidationErrors();
  }
  get formattedTotalAmount(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.totalAmount);
  }
  get formattedSubtotal(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.subtotal);
  }
  get formattedTaxes(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.taxes);
  }
  get selectedBankName(): string {
    const bank = this.banks.find((b) => b.id === this.selectedBank);
    return bank ? bank.name : '';
  }
  hasError(fieldName: string): boolean {
    return this.touched[fieldName] && !!this.validationErrors[fieldName];
  }
  getError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }
  onTermsChange(): void {
    this.validateForm();
  }
  onBankChange(): void {
    this.validateField('bank');
  }
}
