import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { AuthService } from '../../service/auth-service';
import { getAuthorizedMenuItems, MenuItem } from './menu-item';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule,SvgIconComponent]
})
export class SidebarComponent {
  @Input() currentPage: string = '';
  @Output() pageChange = new EventEmitter<string>();

  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  authService = inject(AuthService);

  menuItems: MenuItem[] = [];

  activeNav: string = '';

  ngOnInit(): void {
    this.menuItems = getAuthorizedMenuItems(this.authService.getAuthorizedPageTypesByRole());
  }

  isActive(route: string): boolean {
    if (this.router.url === route || this.router.url.startsWith(route + '/')) {
      return true;
    }
    if (
      (route === '/portfolios' && this.router.url.startsWith('/portfolio/')) ||
      (route === '/projetos' && this.router.url.startsWith('/projeto/')) ||
      (route === '/estrategias' && this.router.url.startsWith('/estrategia/'))
    ) {
      return true;
    }
    return false;
}

  navigate(route: string): void {
    this.activeNav = route;

    // Configurar breadcrumbs baseado na rota
    this.setupBreadcrumbsForRoute(route);

    this.router.navigate([route]);
  }

  private setupBreadcrumbsForRoute(route: string): void {
    // Encontrar o menu item correspondente
    const menuItem = this.menuItems.find(item => item.route === route);

    if (menuItem) {
      if (route === '/inicio') {
        // Para início, apenas inicializar
        this.breadcrumbService.initializeBreadcrumbs();
      } else {
        // Para outras rotas, configurar breadcrumbs
        this.breadcrumbService.setBreadcrumbs([
          {
            label: 'Início',
            url: '/inicio',
            isActive: false
          },
          {
            label: menuItem.label,
            url: route,
            isActive: true
          }
        ]);
      }
    }
  }
  logout(): void {
    this.router.navigate(['/login']);
  }
}
