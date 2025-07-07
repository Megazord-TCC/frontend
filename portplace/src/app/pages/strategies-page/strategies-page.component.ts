import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
interface Strategy {
  id: string;
  name: string;
  activeObjectives: number;
  status: string;
  statusColor: string;
}

@Component({
  selector: 'app-strategies-page',
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent
  ],
  templateUrl: './strategies-page.component.html',
  styleUrl: './strategies-page.component.scss'
})
export class StrategiesPageComponent implements OnInit {
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  strategies: Strategy[] = [
    {
      id: '1',
      name: 'Estratégia 2025',
      activeObjectives: 1,
      status: 'ATIVO',
      statusColor: 'green'
    }
  ];

  filteredStrategies: Strategy[] = [];
  searchTerm = '';
  activeFilter = '';

  ngOnInit(): void {
    // COMPONENTE PAI: Configurar breadcrumbs base
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'Início',
        url: '/inicio',
        isActive: false
      },
      {
        label: 'Estratégias',
        url: '/estrategias',
        isActive: true
      }
    ]);

    // COMPONENTE PAI: Remove qualquer breadcrumb filho somente se existir
    const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
    if (currentBreadcrumbs.length > 2) { // Só remove se tiver mais que [Início, Estratégias]
      this.breadcrumbService.removeChildrenAfter('/estrategias');
    }

    this.filteredStrategies = [...this.strategies];
  }

  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.strategies];

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

    this.filteredStrategies = filtered;
  }

  onStrategyClick(strategyId: string): void {
    this.router.navigate(['/estrategia', strategyId]);
  }

  openCreateModal(): void {
    // Implementar modal de criação
  }
  editStrategy() {
    console.log('Editar estratégia');
    // Lógica para edição
  }

  cancelStrategy() {
    console.log('Cancelar estratégia');
    // Lógica para cancelamento
  }

  deleteStrategy() {
    console.log('Excluir estratégia');
    // Lógica para exclusão
    // Pode adicionar um modal de confirmação aqui
  }

}
