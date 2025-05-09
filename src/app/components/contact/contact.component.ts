import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  selectedPlan: string | null = null;
  formSubmitted = false;

  // 👉 Para el mapa
  mapLoaded = false;
  mapUrl!: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer // inyectar DomSanitizer
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      plan: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['plan']) {
        this.selectedPlan = params['plan'];
        this.contactForm.patchValue({
          plan: this.selectedPlan,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.formSubmitted = true;
      // Aquí iría la lógica para enviar el formulario a un backend
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Getter para acceso fácil a controles
  get f() {
    return this.contactForm.controls;
  }

  // ✅ Método para cargar el mapa al hacer clic
  loadMap(): void {
    const url =
      'https://www.google.com/maps/embed?pb=!4v1746753881734!6m8!1m7!1suXk81gjJRTEzDPkZFqH7VA!2m2!1d1.143136921419192!2d-76.65116834723506!3f48.63200004888046!4f-14.616766014369958!5f0.7820865974627469';
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.mapLoaded = true;
  }
}
