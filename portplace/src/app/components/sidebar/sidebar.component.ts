import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

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

  menuItems: MenuItem[] = [
    { id: 'inicio', label: 'Início', icon: 'assets/icon/home_vetor.svg', route: '/inicio' },
    { id: 'dashboard', label: 'Dashboard', icon: 'assets/icon/dashboard_vetor.svg', route: '/dashboard' },
    { id: 'portfolios', label: 'Portfólios', icon: 'assets/icon/hub_portfolios_vetor.svg', route: '/portfolios' },
    { id: 'projects', label: 'Projetos', icon: 'assets/icon/assignment_projetos_vetor.svg', route: '/projetos' },
    { id: 'strategies', label: 'Estratégias', icon: 'assets/icon/estrategia_vetor.svg', route: '/estrategias' },
    { id: 'resources', label: 'Recursos', icon: 'assets/icon/recursos_vetor.svg', route: '/recursos' },
    { id: 'users', label: 'Usuários', icon: 'assets/icon/usuarios_vetor.svg', route: '/usuarios' }
  ];
  activeNav: string = '';
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

  closeSidebar(): void {
    // Implementar lógica para fechar sidebar em mobile
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
