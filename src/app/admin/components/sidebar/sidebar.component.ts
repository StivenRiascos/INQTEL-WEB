import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faCog,
  faRightFromBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from '../sidebar/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isSidebarOpen = false;
  isMobile = false;
  private subscription: Subscription = new Subscription();

  faBars = faBars;
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faCog = faCog;
  faRightFromBracket = faRightFromBracket;

  constructor(public sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.checkScreenSize();

    // Suscribirse al estado del sidebar
    this.subscription.add(
      this.sidebarService.isExpanded$.subscribe((isExpanded: boolean) => {
        this.isSidebarOpen = isExpanded;
      })
    );
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
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  closeSidebarOnMobile(): void {
    this.sidebarService.closeSidebar();
  }
}
