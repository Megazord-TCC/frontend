import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../components/card/card.component';
import { EvaluationGroupsTabComponent } from '../../../components/evaluation-groups-tab/evaluation-groups-tab.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { Objective, CriteriaGroup, EvaluationGroup, Scenario, Criterion, Portfolio } from '../../../interface/interfacies';
import { Router } from '@angular/router';
import { Project } from '../../../interface/carlos-interfaces';

@Component({
  selector: 'app-objective-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    EvaluationGroupsTabComponent
  ],
  templateUrl: './objective-detail-page.component.html',
  styleUrl: './objective-detail-page.component.scss'
})
export class ObjectiveDetailPageComponent {
  loadingCriteria = false;
  loadingPortfolios = false;
  loadingProjects = false;
  // Tab and filter states
  activeTab = "criterios"
  objectiveFilter = ""
  objectiveSearchTerm = ""
  criteriaSearchTerm = ""
  evaluationSearchTerm = ""
  scenarioFilter = ""
  scenarioSearchTerm = ""
  searchTerm = '';
  estrategiaId:number = 0;
  // Filtered arrays
  allCriterios: Criterion[] = [];
  filteredCriterios: Criterion[] = [];
  allPortfolios: Objective[] = [];
  filteredPortfolios: Objective[] = [];
  allProjetos: Objective[] = [];
  filteredProjetos: Objective[] = [];

   objective: Objective ={
    id: 1,
    name: 'Aumentar lucro',
    disabled: false,
    description: 'Aumentar o lucro da empresa em 20%',
    strategyId: 1,
    status: 'ATIVADO',
    statusColor: 'green',
    createdAt: '2023-01-01T00:00:00Z',
    lastModifiedAt: '2023-01-01T00:00:00Z'
  };

  constructor ( private router: Router){}

  onSearchCriterio(): void {
    let filtered = [...this.allCriterios];
    filtered = filtered.filter(criterio =>
      criterio.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCriterios = filtered;
  }
  onSearchPortfolios(): void {
    let filtered = [...this.allPortfolios];
    filtered = filtered.filter(portfolio =>
      portfolio.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredPortfolios = filtered;
  }
  onSearchProjetos(): void {
    let filtered = [...this.allProjetos];
    filtered = filtered.filter(projeto =>
      projeto.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredProjetos = filtered;
  }
  openCriteriaGroup(criteriaGroupId?: number): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', criteriaGroupId]);
  }
  getStatusColorByDisabled(disabled: boolean): string {
    return disabled ? 'red' : 'green';
  }
  getStatusLabelByDisabled(disabled: boolean): string {
    return disabled ? 'Cancelado' : 'Ativado';
  }
  goBack(): void {
    this.router.navigate(['/estrategias']);
  }
  editObjective() {
    console.log('Editar objetivo');
    // Lógica para edição
  }

  cancelObjective() {
    console.log('Cancelar objetivo');
    // Lógica para cancelamento
  }

  deleteObjective() {
    console.log('Excluir objetivo');
    // Lógica para exclusão
    // Pode adicionar um modal de confirmação aqui
  }
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  openScenarioModal(scenario?: Scenario): void {
    console.log("Opening scenario modal", scenario)
    // Implementar modal de cenário
  }
  openPortfolio(portfolio?: Portfolio): void {
    console.log("Opening portfolio modal", portfolio)
    // Implementar modal de portfólio
  }
  openProjeto(projeto?: Project): void {
    console.log("Opening projeto modal", projeto)
    // Implementar modal de projeto
  }
}
