import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  position: string;
  description: string;
  photo: string;
}

interface Achievement {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss'],
  // Añade esta línea si estás usando componentes standalone (Angular 14+)
  imports: [CommonModule],
})
export class NosotrosComponent implements OnInit {
  teamMembers: TeamMember[] = [
    {
      name: 'Nombre Apellido',
      position: 'CEO / Fundador',
      description:
        'Breve descripción sobre la experiencia y visión del fundador.',
      photo: '../../../assets/images/team/member1.jpg',
    },
    // Otros miembros...
  ];

  achievements: Achievement[] = [
    {
      year: '2015',
      title: 'Fundación de INQTEL',
      description: 'Comenzamos operaciones con nuestros primeros 50 clientes.',
    },
    // Otros logros...
  ];

  constructor() {}

  ngOnInit(): void {}
}
