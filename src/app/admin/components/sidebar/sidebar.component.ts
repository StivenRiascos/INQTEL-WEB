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
  faChevronRight,
  faChevronLeft,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarService } from './sidebar.service';
import { Subscription } from 'rxjs';

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

  // Icons
  faBars = faBars;
  faTachometerAlt = faTachometerAlt;
  faUsers = faUsers;
  faCog = faCog;
  faRightFromBracket = faRightFromBracket;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faUser = faUser;

  constructor(public sidebarService: SidebarService) {}

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
      this.sidebarService.setCollapsed(false);
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleCollapse(): void {
    this.sidebarService.toggleCollapsed();
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidebarService.closeSidebar();
    }
  }
}
