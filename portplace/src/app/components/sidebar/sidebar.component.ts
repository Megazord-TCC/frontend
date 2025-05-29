import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

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

  menuItems: MenuItem[] = [
    { id: 'inicio', label: 'Início', icon: 'assets/icon/home_vetor.svg', route: '/inicio' },
    { id: 'dashboard', label: 'Dashboard', icon: 'assets/icon/dashboard_vetor.svg', route: '/dashboard' },
    { id: 'portfolios', label: 'Portfólios', icon: 'assets/icon/hub_portfolios_vetor.svg', route: '/portfolios' },
    { id: 'projects', label: 'Projetos', icon: 'assets/icon/assignment_projetos_vetor.svg', route: '/projetos' },
    { id: 'strategies', label: 'Estratégias', icon: 'assets/icon/estrategia_vetor.svg', route: '/estrategias' },
    { id: 'resources', label: 'Recursos', icon: 'assets/icon/recursos_vetor.svg', route: '/recursos' },
    { id: 'users', label: 'Usuários', icon: 'assets/icon/usuarios_vetor.svg', route: '/usuarios' }
  ];

  constructor(private router: Router) {}
  activeNav: string = '';
  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigate(route: string): void {
     this.activeNav = route;
    this.router.navigate([route]);
  }

  closeSidebar(): void {
    // Implementar lógica para fechar sidebar em mobile
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
