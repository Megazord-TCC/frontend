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
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public router: Router) {}

  public navigationCards = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Monitore portfólios em andamento com métricas de qualidade.',
      icon: ChartColumn,
      route: '/dashboard',
    },
    {
      id: 'portfolios',
      title: 'Portfólios',
      description: 'Gerencie e administre seus portfólios com configuração e dependências.',
      icon: Target,
      route: '/portfolios',
    },
    {
      id: 'projetos',
      title: 'Projetos',
      description: 'Gerencie e administre seus projetos.',
      icon: FolderOpen,
      route: '/projetos',
    },
    {
      id: 'estrategias',
      title: 'Estratégias',
      description: 'Gerencie e configure as estratégias para projetos e portfólios.',
      icon: TrendingUp,
      route: '/estrategias',
    },
    {
      id: 'recursos',
      title: 'Recursos',
      description: 'Gerencie recursos para execução de recursos humanos.',
      icon: Package,
      route: '/recursos',
    },
    {
      id: 'usuarios',
      title: 'Usuários',
      description: 'Gerencie o cadastro dos usuários do sistema.',
      icon: Users,
      route: '/usuarios',
    },
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
