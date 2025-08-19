import { Component, OnInit, inject } from '@angular/core';
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
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, BreadcrumbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    // Inicializar breadcrumbs apenas com "Início"
    this.breadcrumbService.initializeBreadcrumbs();
  }

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
      route: '/projetos',
      color: '#10b981'
    },
    {
      id: 'strategies',
      title: 'Estratégias',
      description: 'Gerencie e cadastre as estratégias para avaliar projetos e os vínculos a portfólios',
      icon: 'assets/icon/estrategia_vetor.svg',
      route: '/estrategias',
      color: '#f59e0b'
    },
    {
      id: 'resources',
      title: 'Recursos',
      description: 'Gerencie cargos, pessoas e alocações de recursos humanos',
      icon: 'assets/icon/recursos_vetor.svg',
      route: '/recursos',
      color: '#ef4444'
    },
    {
      id: 'users',
      title: 'Usuários',
      description: 'Gerencie o cadastro dos usuários do sistema',
      icon: 'assets/icon/usuarios_vetor.svg',
      route: '/usuarios',
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
