import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  ChartColumn,
  Target,
  FolderOpen,
  TrendingUp,
  Package,
  Users,
  Home as HomeIcon,
  X
} from 'lucide-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,SvgIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public router: Router) {}

   navigationCards = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Monitore portfólios em andamento com controle de práticos',
      icon: 'assets/icon/dashboard_vetor.svg',
      route: '/dashboard',
      color: '#3b82f6'
    },
    {
      id: 'portfolios',
      title: 'Portfólios',
      description: 'Gerencie e cadastre seus portfólios, seus riscos, comunicações e responsáveis',
      icon: 'assets/icon/hub_portfolios_vetor.svg',
      route: '/portfolios',
      color: '#8b5cf6'
    },
    {
      id: 'projects',
      title: 'Projetos',
      description: 'Gerencie e cadastre seus projetos',
      icon: 'assets/icon/assignment_projetos_vetor.svg',
      route: '/projects',
      color: '#10b981'
    },
    {
      id: 'strategies',
      title: 'Estratégias',
      description: 'Gerencie e cadastre as estratégias para avaliar projetos e os vínculos a portfólios',
      icon: 'assets/icon/estrategia_vetor.svg',
      route: '/strategies',
      color: '#f59e0b'
    },
    {
      id: 'resources',
      title: 'Recursos',
      description: 'Gerencie cargos, pessoas e alocações de recursos humanos',
      icon: 'assets/icon/recursos_vetor.svg',
      route: '/resources',
      color: '#ef4444'
    },
    {
      id: 'users',
      title: 'Usuários',
      description: 'Gerencie o cadastro dos usuários do sistema',
      icon: 'assets/icon/usuarios_vetor.svg',
      route: '/users',
      color: '#6b7280'
    }
  ];

  public sidebarItems = [
    { id: 'inicio', label: 'Início', icon: HomeIcon, route: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: ChartColumn, route: '/dashboard' },
    { id: 'portfolios', label: 'Portfólios', icon: Target, route: '/portfolios' },
    { id: 'projetos', label: 'Projetos', icon: FolderOpen, route: '/projetos' },
    { id: 'estrategias', label: 'Estratégias', icon: TrendingUp, route: '/estrategias' },
    { id: 'recursos', label: 'Recursos', icon: Package, route: '/recursos' },
    { id: 'usuarios', label: 'Usuários', icon: Users, route: '/usuarios' },
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  exitPage() {
    window.location.reload();
  }
}
