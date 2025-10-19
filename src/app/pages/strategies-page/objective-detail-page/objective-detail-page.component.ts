import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../components/card/card.component';
import { EvaluationGroupsTabComponent } from '../../../components/evaluation-groups-tab/evaluation-groups-tab.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { Objective, CriteriaGroup, EvaluationGroup, Scenario, Criterion, Portfolio, FormModalConfig } from '../../../interface/interfacies';
import { FormField } from '../../../interface/interfacies';
import { StrategyStatusEnum } from '../../../interface/interfacies';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../interface/carlos-interfaces';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { StrategiaObjetivoService } from '../../../service/strategia-objetivo.service';
import { CriterioService } from '../../../service/criterio.service';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { map, Observable } from 'rxjs';
import { mapCriterionPageDtoToCriterionTableRowPage } from '../../../mappers/criterion-mappers';
import { TableComponent } from '../../../components/table/table.component';
import { mapPortfolioDTOPageToPortfolioTableRowPage } from '../../../mappers/portfolio-mapper';
import { mapProjectPageDtoToProjectTableRowPage } from '../../../mappers/projects-mappers';
import { getColumns as getCriterionColumns, getFilterButtons as getCriterionFilterButtons, getFilterText as getCriterionFilterText, getActionButton as getCriterionActionButton } from './criteria-table-config';
import { getColumns as getPortfoliosColumns, getFilterButtons as getPortfoliosFilterButtons, getFilterText as getPortfoliosFilterText, getActionButton as getPortfoliosActionButton } from './portfolio-table-config';
import { getColumns as getProjectColumns, getFilterButtons as getProjectFilterButtons, getFilterText as getProjectFilterText, getActionButton as getProjectActionButton } from './portfolio-table-config';

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
    EvaluationGroupsTabComponent,
    TableComponent
  ],
  templateUrl: './objective-detail-page.component.html',
  styleUrl: './objective-detail-page.component.scss'
})
export class ObjectiveDetailPageComponent implements OnInit {
   editStrategyConfig: FormModalConfig = {
      title: 'Editar estratégia',
      fields: [
        {
          id: 'name',
          label: 'Nome',
          type: 'text',
          value: '',
          required: true,
          placeholder: 'Digite o nome da estratégia'
        },
        {
          id: 'description',
          label: 'Descrição',
          type: 'textarea',
          value: '',
          required: false,
          placeholder: 'Digite a descrição da estratégia',
          rows: 4
        }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    };
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
  objectiveId:number = 0;
  // Filtered arrays
  allCriterios: Criterion[] = [];
  filteredCriterios: Criterion[] = [];
  allPortfolios: Objective[] = [];
  filteredPortfolios: Objective[] = [];
  allProjetos: Objective[] = [];
  filteredProjetos: Objective[] = [];

  // Propriedades para o app-table de critérios
  criterionColumns = getCriterionColumns();
  criterionFilterButtons = getCriterionFilterButtons();
  criterionFilterText = getCriterionFilterText();
  criterionActionButton = getCriterionActionButton();
  // Propriedades para o app-table de portfolios
  portfoliosColumns = getPortfoliosColumns();
  portfoliosFilterButtons = getPortfoliosFilterButtons();
  portfoliosFilterText = getPortfoliosFilterText();
  portfoliosActionButton = getPortfoliosActionButton();
  // Propriedades para o app-table de projetos
  projectColumns = getProjectColumns();
  projectFilterButtons = getProjectFilterButtons();
  projectFilterText = getProjectFilterText();
  projectActionButton = getProjectActionButton();
  criteriaGroupId = 0;

  objective?: Objective;
  showEditModal = false;
  showDeleteModal = false;


  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private objetivoService: StrategiaObjetivoService,
    private criterioService: CriterioService
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
      const objectiveIdParam = params.get('objetivoId');
      this.objectiveId = objectiveIdParam ? Number(objectiveIdParam) : 0;
      this.loadObjective();

    });
  }

  getDataForCriteriaTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
    return this.objetivoService.getObjectiveCriteria(this.estrategiaId, this.objectiveId, queryParams).pipe(
      map((page: Page<any>) => mapCriterionPageDtoToCriterionTableRowPage(page))
    );
  };
  getDataForPortfoliosTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
    return this.objetivoService.getObjectivePortfolios(this.estrategiaId, this.objectiveId, queryParams).pipe(
      map((page: Page<any>) => mapPortfolioDTOPageToPortfolioTableRowPage(page))
    );
  };
  getDataForProjectsTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
    return this.objetivoService.getObjectiveProjects(this.estrategiaId, this.objectiveId, queryParams).pipe(
      map((page: Page<any>) => mapProjectPageDtoToProjectTableRowPage(page))
    );
  };


  async loadObjective(): Promise<void> {
    try {
      const obj = await this.objetivoService.getObjectiveById(this.estrategiaId, this.objectiveId).toPromise();
      this.objective = obj;
      console.log('Objetivo carregado:', this.objective);
      this.breadcrumbService.addChildBreadcrumb({
          label: `Objetivo: ${this.objective?.name}`,
          url: `/estrategia/${this.estrategiaId}/objetivo/${this.objective!.name}`,
          isActive: true
        });
      const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
      if (currentBreadcrumbs.length > 4) {
        this.breadcrumbService.removeChildrenAfter(`/estrategia/${this.estrategiaId}`);
      }
    } catch (err) {
      console.error('Erro ao buscar objetivo:', err);
    }
  }


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
  openCriteria(criteriaId?: number): void {
    let id: number | undefined;
    if (typeof criteriaId === 'object' && criteriaId !== null && 'id' in criteriaId) {
      id = (criteriaId as { id: number }).id;
    } else if (typeof criteriaId === 'number') {
      id = criteriaId;
    }
    if (id) {
      this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', this.criteriaGroupId,'criterio',id]);
    } else {
      console.warn('ID da estratégia não encontrado:', criteriaId);
    }

  }

  getStatusColorByDisabled(disabled: boolean): string {
    return disabled ? 'red' : 'green';
  }
  getStatusLabelByDisabled(disabled: boolean): string {
    return disabled ? 'Cancelado' : 'Ativado';
  }
  goBack(): void {
    // Remove o breadcrumb do objetivo antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.estrategiaId}/objetivo/${this.objectiveId}`);
    this.router.navigate([`/estrategia`, this.estrategiaId]);
  }
  editObjective() {
    this.objetivoService.updateObjective(this.estrategiaId, this.objectiveId, {
      name: this.objective?.name || '',
      description: this.objective?.description || '',
    }).subscribe({
      next: () => {
        console.log('Objetivo editado com sucesso');
        this.loadObjective();
      },
      error: (err) => {
        console.error('Erro ao editar objetivo:', err);
      }
    });
  }

  onSaveObjectiveEdit(fields: FormField[]): void {
    const objectiveData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    const updatedObjective = {
      ...this.objective,
      name: objectiveData.name,
      description: objectiveData.description
    };

    // Se quiser sanitizar, crie uma função sanitizeObjectiveData similar à sanitizeStrategyData
    // const sanitizedObjective = this.sanitizeObjectiveData(updatedObjective);
    const sanitizedObjective = updatedObjective;

    console.log('Dados do objetivo a serem atualizados:', sanitizedObjective);

    this.objetivoService.updateObjective(this.estrategiaId, this.objectiveId, sanitizedObjective)
      .subscribe({
        next: (updatedObjective) => {
          console.log('Objetivo alterado:', updatedObjective);
          this.loadObjective();
          this.closeEditModal();
          this.loadObjective();
        },
        error: (err) => {
          console.error('Erro ao alterar objetivo:', err);
          if (err.error) {
            console.error('Detalhes do erro:', err.error);
          }
        }
      });
  }



  deleteObjective() {
    this.objetivoService.disableObjective(this.estrategiaId, this.objectiveId).subscribe({
      next: () => {
        console.log('Objetivo excluído com sucesso');
        this.closeDeleteModal();
        this.goBack();
      },
      error: (err) => {
        console.error('Erro ao excluir objetivo:', err);
      }
    });
  }
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  openScenarioModal(scenario?: Scenario): void {
    console.log("Opening scenario modal", scenario)
    // Implementar modal de cenário
  }
  openPortfolio(portfolio?: number): void {
    console.log("Opening portfolio modal", portfolio)
    // Implementar modal de portfólio
  }
  openProjeto(projeto?: Project): void {
    console.log("Opening projeto modal", projeto)
    // Implementar modal de projeto
  }
  openEditModal(): void {
    this.editStrategyConfig.fields[0].value = this.objective?.name || '';
    this.editStrategyConfig.fields[1].value = this.objective?.description || '';

    this.editStrategyConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }
  getProjectStatusEnumToText = (statusEnum: any): string => {
    switch (statusEnum) {
        case "IDLE": return "PARADO";
        case "ACTIVE": return "ATIVO";
        case "CANCELLED": return "CANCELADO";
        case "COMPLETED": return "FINALIZADO";
        case "ON_HOLD": return "PAUSADO";
        default: return "SEM STATUS";
    }
}

  getProjectStatusColor(status: any): string {
    switch (status) {
      case 'IDLE':
        return 'yellow';
      case 'ACTIVE':
        return 'green';
      case 'CANCELLED':
        return 'blue';
      case 'COMPLETED':
        return 'gray';
      default:
        return 'gray';
    }
  }
  public parseDateString(dateStr: string | undefined): Date | null {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second = '0'] = timePart.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  }
}
