import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

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

interface PaymentData {
  method: 'PSE' | 'CARD';
  amount: number;
  concept: string;
  invoiceNumber: string;
  customerName: string;
  customerID: string;
  customerEmail: string;
  customerPhone: string;
  bankId?: string;
  personType?: 'natural' | 'juridica';
  cardDetails?: CardDetails;
}

interface ValidationErrors {
  [key: string]: string;
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

  // Customer Information
  customerName: string = 'SNEIDER STIVEN PATIÑO RIASCOS';
  customerID: string = '1006849985';
  customerPhone: string = '3204160395';
  customerEmail: string = 'stivenareyalopa11@gmail.com';

  // Payment Information
  paymentConcept: string = 'DERECHOS D';
  invoiceNumber: string = '58677';
  totalAmount: number = 1475690.0;
  taxes: number = 0.0;
  subtotal: number = 1475690.0;

  // Form State
  selectedPaymentMethod: 'pse' | 'card' | null = null;
  acceptTerms: boolean = false;
  personType: 'natural' | 'juridica' = 'natural';
  selectedBank: string = '';
  isProcessing: boolean = false;
  loadingMessage: string = 'Procesando pago...';

  // Card Details
  cardDetails: CardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  };

  // Validation
  validationErrors: ValidationErrors = {};
  touched: { [key: string]: boolean } = {};

  // Constants
  readonly MIN_CARD_NUMBER_LENGTH = 13;
  readonly MAX_CARD_NUMBER_LENGTH = 19;
  readonly CVV_LENGTH = 3;
  readonly AMEX_CVV_LENGTH = 4;

  banks: Bank[] = [
    { id: 'bancolombia', name: 'Bancolombia', code: 'BANCOLOMBIA' },
    { id: 'banco-bogota', name: 'Banco de Bogotá', code: 'BANCO_BOGOTA' },
    { id: 'davivienda', name: 'Davivienda', code: 'DAVIVIENDA' },
    { id: 'bbva', name: 'BBVA', code: 'BBVA' },
    {
      id: 'banco-occidente',
      name: 'Banco de Occidente',
      code: 'BANCO_OCCIDENTE',
    },
    { id: 'banco-popular', name: 'Banco Popular', code: 'BANCO_POPULAR' },
    { id: 'av-villas', name: 'Banco AV Villas', code: 'AV_VILLAS' },
    { id: 'caja-social', name: 'Banco Caja Social', code: 'CAJA_SOCIAL' },
    { id: 'nequi', name: 'Nequi', code: 'NEQUI' },
    { id: 'daviplata', name: 'Daviplata', code: 'DAVIPLATA' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculateAmounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateAmounts(): void {
    this.subtotal = this.totalAmount - this.taxes;
  }

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

  // Validation Methods
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (
      cleanNumber.length < this.MIN_CARD_NUMBER_LENGTH ||
      cleanNumber.length > this.MAX_CARD_NUMBER_LENGTH
    ) {
      return false;
    }

    // Luhn algorithm validation
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

  // Input Formatting
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

  // Field Validation
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
    // Validate all fields based on selected payment method
    if (this.selectedPaymentMethod === 'card') {
      this.validateField('cardNumber');
      this.validateField('expiry');
      this.validateField('cvv');
      this.validateField('cardName');
    } else if (this.selectedPaymentMethod === 'pse') {
      this.validateField('bank');
    }
  }

  // Form Validation
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

  // Payment Processing
  processPSEPayment(): void {
    if (!this.canProceedPSE()) {
      this.showValidationErrors();
      return;
    }

    this.isProcessing = true;
    this.loadingMessage = 'Conectando con el banco...';
    this.clearValidationErrors();

    const paymentData: PaymentData = {
      method: 'PSE',
      bankId: this.selectedBank,
      personType: this.personType,
      amount: this.totalAmount,
      concept: this.paymentConcept,
      invoiceNumber: this.invoiceNumber,
      customerName: this.customerName,
      customerID: this.customerID,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Pago PSE iniciado:', paymentData);
      this.handlePaymentSuccess(
        {
          transactionId: 'PSE-' + Date.now(),
          redirectUrl: 'https://banco-simulado.com/pse',
        },
        'PSE'
      );
    }, 3000);
  }

  processCardPayment(): void {
    if (!this.canProceedCard()) {
      this.showValidationErrors();
      return;
    }

    this.isProcessing = true;
    this.loadingMessage = 'Procesando tarjeta...';
    this.clearValidationErrors();

    const paymentData: PaymentData = {
      method: 'CARD',
      cardDetails: { ...this.cardDetails },
      amount: this.totalAmount,
      concept: this.paymentConcept,
      invoiceNumber: this.invoiceNumber,
      customerName: this.customerName,
      customerID: this.customerID,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
    };

    // Simulate API call
    setTimeout(() => {
      console.log('Pago con tarjeta procesado:', paymentData);
      this.handlePaymentSuccess(
        {
          transactionId: 'CARD-' + Date.now(),
          status: 'approved',
        },
        'CARD'
      );
    }, 3000);
  }

  // Payment Response Handlers
  private handlePaymentSuccess(response: any, method: string): void {
    this.isProcessing = false;

    if (response.redirectUrl) {
      // For PSE payments, redirect to bank
      window.location.href = response.redirectUrl;
    } else {
      // For card payments or successful transactions
      alert(
        `Pago ${method} procesado exitosamente. ID: ${response.transactionId}`
      );
      // Here you would navigate to success page
      // this.router.navigate(['/payment-success']);
    }
  }

  private handlePaymentError(error: any): void {
    this.isProcessing = false;
    let errorMessage =
      'Hubo un error al procesar el pago. Por favor intente nuevamente.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  }

  // Utility Methods
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
    this.cardDetails = {
      number: '',
      expiry: '',
      cvv: '',
      name: '',
    };
    this.clearValidationErrors();
  }

  // Getters for template
  get formattedTotalAmount(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(this.totalAmount);
  }

  get formattedSubtotal(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(this.subtotal);
  }

  get formattedTaxes(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(this.taxes);
  }

  get selectedBankName(): string {
    const bank = this.banks.find((b) => b.id === this.selectedBank);
    return bank ? bank.name : '';
  }

  // Template Helper Methods
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
