import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faCog,
  faRightFromBracket,
  faBars,
  faChevronRight,
  faChevronLeft,
  faUser,
  faFileInvoiceDollar,
  // Puedes considerar añadir faHome si decides un botón explícito,
  // pero para el logo no es necesario un nuevo icono aquí.
} from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';
import { UserService, ClientProfile } from '../../../services/user.service';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  isCollapsed = false;
  isMobile = false;
  private subscription: Subscription = new Subscription();

  currentUser: ClientProfile | null = null;

  // Icons
  faBars = faBars;
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faFileInvoiceDollar = faFileInvoiceDollar; // Ya estaba
  faCog = faCog;
  faRightFromBracket = faRightFromBracket;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faUser = faUser;

  constructor(
    public sidebarService: SidebarService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();

    this.subscription.add(
      this.sidebarService.isExpanded$.subscribe((isExpanded: boolean) => {
        this.isSidebarOpen = isExpanded;
      })
    );

    this.subscription.add(
      this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
        this.isCollapsed = isCollapsed;
      })
    );

    const currentUserAuth: User | null = this.authService.currentUserValue;
    if (currentUserAuth) {
      this.userService.getUserById(currentUserAuth.id).subscribe({
        next: (userProfile) => {
          console.log('Usuario cargado en sidebar:', userProfile);
          this.currentUser = userProfile;
        },
        error: (err) => {
          console.error('Error cargando usuario en sidebar:', err);
          this.currentUser = null; // Asegúrate de manejar el caso de error
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile && this.isCollapsed) {
      this.sidebarService.setCollapsed(false); // Si es móvil, no debería estar colapsado en el sentido de 'minimizado'
    }
    // Si no es móvil y el sidebar estaba cerrado (isExpanded = false), mantenlo cerrado
    // Si es móvil y el sidebar estaba abierto, el toggle lo manejará.
    // Este servicio ya maneja la expansión en base al tamaño de la pantalla inicialmente.
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleCollapse(): void {
    if (!this.isMobile) { // Solo permitir colapsar en escritorio
      this.sidebarService.toggleCollapsed();
    }
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidebarService.closeSidebar();
    }
  }

  // Nuevo método para navegar al home del sitio público
  navigateToHome(): void {
    this.router.navigate(['/']);
    this.closeSidebarOnMobile();
  }

  // Nuevo método para cerrar sesión
  logout(): void {
    this.authService.logout(); // El servicio AuthService ya se encarga de redirigir
    this.closeSidebarOnMobile();
    // No es necesario un this.router.navigate aquí si AuthService ya lo hace.
  }
}