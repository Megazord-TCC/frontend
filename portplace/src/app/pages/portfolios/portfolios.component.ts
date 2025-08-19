import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
import { PortfolioModalComponent } from '../../components/portfolio-modal/portfolio-modal.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
type BadgeColor = 'gray' | 'green' | 'blue' | 'red' | 'yellow';
interface Portfolio {
  id: number;
  name: string;
  budget: string;
  inProgress: number;
  completed: number;
  cancelled: number;
  status: string;
  statusColor: BadgeColor;
}

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss'],
   imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    PortfolioModalComponent,
    SvgIconComponent,
    BreadcrumbComponent
  ],
})
export class PortfoliosComponent implements OnInit {
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);

  showModal = false;
  activeFilter = 'all';
  searchTerm = '';

  portfolios: Portfolio[] = [
    {
      id: 1,
      name: 'Portfólio 1',
      budget: 'R$ 1.000,00',
      inProgress: 3,
      completed: 4,
      cancelled: 6,
      status: 'VAZIO',
      statusColor: 'gray'
    },
    {
      id: 2,
      name: 'Portfólio 2',
      budget: 'R$ 1.000,00',
      inProgress: 2,
      completed: 5,
      cancelled: 2,
      status: 'EM ANDAMENTO',
      statusColor: 'green'
    }
  ];

  ngOnInit(): void {
    // COMPONENTE PAI: Configurar breadcrumbs base e remover filhos
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'Início',
        url: '/inicio',
        isActive: false
      },
      {
        label: 'Portfólios',
        url: '/portfolios',
        isActive: true
      }
    ]);

    // COMPONENTE PAI: Remove qualquer breadcrumb filho que possa existir
    this.breadcrumbService.removeChildrenAfter('/portfolios');
  }

  onFilterChange(filter: string): void {
    this.activeFilter = filter;
  }
  onSearchChange(): void {
    this.applyFilters();
  }
  openCreateModal(): void {
    // Implementar modal de criação
  }
  applyFilters(): void {
    let filtered = [...this.portfolios];

    if (this.activeFilter) {
      filtered = filtered.filter(strategy =>
        strategy.status.toLowerCase() === this.activeFilter.toLowerCase()
      );
    }

    if (this.searchTerm) {
      filtered = filtered.filter(strategy =>
        strategy.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.portfolios = filtered;
  }

  onPortfolioClick(portfolioId: number): void {
    this.router.navigate(['/portfolio', portfolioId]);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
