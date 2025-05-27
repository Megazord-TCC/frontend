import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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
  imports: [CommonModule]
})
export class SidebarComponent {
  @Input() currentPage: string = '';
  @Output() pageChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { id: 'inicio', label: 'Início', icon: 'assets/icon/home.svg', route: '/inicio' },
    { id: 'dashboard', label: 'Dashboard', icon: 'assets/icon/dashboard_icon.svg', route: '/dashboard' },
    { id: 'portfolios', label: 'Portfólios', icon: 'assets/icon/hub_portfolios_icon.svg', route: '/portfolios' },
    { id: 'projects', label: 'Projetos', icon: 'assets/icon/assignment_projetos_icon.svg', route: '/projects' },
    { id: 'strategies', label: 'Estratégias', icon: 'assets/icon/estrategia_icon.svg', route: '/strategies' },
    { id: 'resources', label: 'Recursos', icon: 'assets/icon/recursos_icon.svg', route: '/resources' },
    { id: 'users', label: 'Usuários', icon: 'assets/icon/usuarios_icon.svg', route: '/users' }
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
