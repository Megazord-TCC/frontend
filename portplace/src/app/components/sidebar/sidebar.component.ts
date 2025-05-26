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
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() currentPage: string = '';
  @Output() pageChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { id: 'inicio', label: 'Início', icon: 'home', route: '' },
    { id: 'dashboard', label: 'Dashboard', icon: 'bar-chart-3', route: '/dashboard' },
    { id: 'portfolios', label: 'Portfólios', icon: 'target', route: '/portfolios' },
    { id: 'projects', label: 'Projetos', icon: 'folder-open', route: '/projects' },
    { id: 'strategies', label: 'Estratégias', icon: 'trending-up', route: '/strategies' },
    { id: 'resources', label: 'Recursos', icon: 'package', route: '/resources' },
    { id: 'users', label: 'Usuários', icon: 'users', route: '/users' }
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  closeSidebar(): void {
    // Implementar lógica para fechar sidebar em mobile
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
