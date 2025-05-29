import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
interface Objective {
  id: string;
  name: string;
  linkedCriteria: number;
  activePortfolios: number;
  activeProjects: number;
  status: 'ATIVADO' | 'CANCELADO';
  statusColor: 'green' | 'gray';
}
@Component({
  selector: 'app-strategy-detail-page',
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent],
  templateUrl: './strategy-detail-page.component.html',
  styleUrl: './strategy-detail-page.component.scss'
})
export class StrategyDetailPageComponent implements OnInit{
  strategy: any = {
    id: '2',
    name: 'Estratégia 2024',
    status: 'ATIVO',
    description: 'Descrição da estratégia.',
    lastUpdate: 'Última alteração realizada por Carlos Bentes em 01/01/2025 14:30'
  };

  objectives: Objective[] = [
    {
      id: '1',
      name: 'Aumentar lucro',
      linkedCriteria: 1,
      activePortfolios: 1,
      activeProjects: 2,
      status: 'ATIVADO',
      statusColor: 'green'
    },
    {
      id: '2',
      name: 'Capacitar empregados',
      linkedCriteria: 0,
      activePortfolios: 0,
      activeProjects: 1,
      status: 'CANCELADO',
      statusColor: 'gray'
    }
  ];

  filteredObjectives: Objective[] = [];
  activeTab = 'objetivos';
  objectiveFilter = '';
  objectiveSearchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredObjectives = [...this.objectives];
  }

  goBack(): void {
    this.router.navigate(['/strategies']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  getTabName(tab: string): string {
    const tabNames: { [key: string]: string } = {
      'criterios': 'Grupos de critérios',
      'avaliacoes': 'Grupos de avaliações',
      'cenarios': 'Cenários',
      'portfolios': 'Portfólios e projetos'
    };
    return tabNames[tab] || tab;
  }

  onObjectiveFilterChange(filter: string): void {
    this.objectiveFilter = this.objectiveFilter === filter ? '' : filter;
    this.applyObjectiveFilters();
  }

  onObjectiveSearchChange(): void {
    this.applyObjectiveFilters();
  }

  applyObjectiveFilters(): void {
    let filtered = [...this.objectives];

    if (this.objectiveFilter) {
      filtered = filtered.filter(objective =>
        objective.status.toLowerCase() === this.objectiveFilter.toLowerCase()
      );
    }

    if (this.objectiveSearchTerm) {
      filtered = filtered.filter(objective =>
        objective.name.toLowerCase().includes(this.objectiveSearchTerm.toLowerCase())
      );
    }

    this.filteredObjectives = filtered;
  }

  openObjectiveModal(objective?: Objective): void {
    // Implementar modal de objetivo
  }
}
