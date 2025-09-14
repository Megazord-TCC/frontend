import { TableComponent } from '../../../components/table/table.component';
import { getColumns as getCriteriaColumns, getFilterButtons as getCriteriaFilterButtons, getFilterText as getCriteriaFilterText, getActionButton as getCriteriaActionButton } from './criteria-group-table-config';
import { getColumns as getObjectivesColumns, getFilterButtons as getObjectivesFilterButtons, getFilterText as getObjectivesFilterText, getActionButton as getObjectivesActionButton } from './objectives-table-config';
import { mapObjectivePageDtoToObjectiveTableRowPage } from '../../../mappers/objectives-mappers';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { CriteriaGroup, EvaluationGroup, Objective, Scenario, FormField, Criterion, ImportanceScale, CriteriaComparison, RoleEnum, User, CriteriaGroupStatusEnum, Strategy, StrategyStatusEnum, FormModalConfig } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { CriteriaGroupService } from '../../../service/criteria-group.service';
import { EstrategiaService } from '../../../service/estrategia.service';
import { StrategiaObjetivoService } from '../../../service/strategia-objetivo.service';
import { firstValueFrom, map, Observable, retry, Subscription } from 'rxjs';
import { EvaluationGroupsTabComponent } from '../../../components/evaluation-groups-tab/evaluation-groups-tab.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { ScenarioTabComponent } from '../../../components/scenario-tab/scenario-tab.component';
import { mapCriteriaGroupPageDtoToCriteriaGroupTableRowPage } from '../../../mappers/criteria-group-mappers';


@Component({
  selector: 'app-strategy-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    EvaluationGroupsTabComponent,
    ScenarioTabComponent,
    TableComponent
  ],
  templateUrl: './strategy-detail-page.component.html',
  styleUrl: './strategy-detail-page.component.scss'
})
export class StrategyDetailPageComponent implements OnInit, OnDestroy {
  @ViewChild('objectivesTableComponent') objectivesTableComponent!: TableComponent;
  @ViewChild('criteriaTableComponent') criteriaTableComponent!: TableComponent;

  // Propriedades para o app-table de grupos de critérios
  criteriaColumns = getCriteriaColumns();
  criteriaFilterButtons = getCriteriaFilterButtons();
  criteriaFilterText = getCriteriaFilterText();
  criteriaActionButton = getCriteriaActionButton();

  // Propriedades para o app-table de objetivos
  objectivesColumns = getObjectivesColumns();
  objectivesFilterButtons = getObjectivesFilterButtons();
  objectivesFilterText = getObjectivesFilterText();
  objectivesActionButton = getObjectivesActionButton();


  private routeSubscription?: Subscription;
  strategy: Strategy = {
    name: 'Carregando...',
    description: 'Carregando descrição...'
  };

  // Campos editáveis para binding com inputs
  strategyName: string = '';
  strategyDescription: string = '';


  showCreateModal = false;
  showEditModal = false;
  showCancelModal = false;
  loadingProjects = false;

  // Configurações dos modais
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

  cancelStrategyConfig: FormModalConfig = {
    title: 'Cancelar estratégia',
    fields: [
      {
        id: 'reason',
        label: 'Justificativa do cancelamento',
        type: 'textarea',
        value: '',
        required: true,
        placeholder: 'Digite o motivo do cancelamento...',
        rows: 4
      }
    ],
    validationMessage: 'A justificativa do cancelamento é obrigatória.'
  };

  formConfigs: { [key: string]: any } = {
    objetivos: {
      title: 'Cadastrar novo objetivo',
      fields: [
        { id: 'name', label: 'Nome', type: 'text', value: '', required: true, placeholder: 'Digite o nome do objetivo' },
        { id: 'description', label: 'Descrição', type: 'textarea', value: '', required: false, placeholder: 'Digite a descrição do objetivo', rows: 4 }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    },
    criterios: {
      title: 'Cadastrar novo grupo de critérios',
      fields: [
        { id: 'name', label: 'Nome do grupo', type: 'text', value: '', required: true, placeholder: 'Digite o nome do grupo' },
        { id: 'description', label: 'Descrição', type: 'textarea', value: '', required: false, placeholder: 'Digite a descrição do grupo', rows: 4 }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    },
    avaliacoes: {
      title: 'Cadastrar nova avaliação',
      fields: [
        { id: 'name', label: 'Nome da avaliação', type: 'text', value: '', required: true, placeholder: 'Digite o nome da avaliação' },
        { id: 'criteriaGroup', label: 'Grupo de critérios', type: 'text', value: '', required: true, placeholder: 'Digite o grupo de critérios' }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    },
    cenarios: {
      title: 'Cadastrar novo cenário',
      fields: [
        { id: 'name', label: 'Nome do cenário', type: 'text', value: '', required: true, placeholder: 'Digite o nome do cenário' },
        { id: 'budget', label: 'Orçamento', type: 'text', value: '', required: true, placeholder: 'Digite o orçamento' },
        { id: 'evaluation', label: 'Avaliação', type: 'text', value: '', required: true, placeholder: 'Digite a avaliação' }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    }
  };

  currentFormConfig: any = this.formConfigs['objetivos'];
   // Filtered arrays
  allObjectives: Objective[] = [];
  filteredObjectives: Objective[] = [];
  filteredCriteriaGroups: CriteriaGroup[] = [];
  filteredEvaluationGroups: EvaluationGroup[] = [];
  filteredScenarios: Scenario[] = [];


  criteriaGroups: CriteriaGroup[] = [];
  allCriteriaGroups: CriteriaGroup[] = [];
  // Tab and filter states
  activeTab = "objetivos"
  objectiveFilter = ""
  objectiveSearchTerm = ""
  criteriaSearchTerm = ""
  evaluationSearchTerm = ""
  scenarioFilter = ""
  scenarioSearchTerm = ""
  estrategiaId:number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private criterioService: CriteriaGroupService,
    private estrategiaService: EstrategiaService,
    private breadcrumbService: BreadcrumbService,
    private objetivoService: StrategiaObjetivoService
  ) {}

  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;

      if (this.estrategiaId) {
        this.loadStrategyDetails(this.estrategiaId);
      }

    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

 //critérios Método de busca para o app-table de grupos de
  getDataForCriteriaGroupsTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
    return this.criterioService.getCriteriaGroupPage(this.strategy.id!, queryParams).pipe(
      map(page => {
        console.log('[LOG] Retorno da API getCriteriaGroupPage:', page);
        return mapCriteriaGroupPageDtoToCriteriaGroupTableRowPage(page);
      })
    );
  };
  // Método de busca para o app-table de grupos de objetivos
  getDataForObjetivesTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams) => {
    return this.objetivoService.getObjectivesPage(this.strategy.id!, queryParams).pipe(
      map(page => {
        console.log('[LOG] Retorno da API getObjectivesPage:', page);
        return mapObjectivePageDtoToObjectiveTableRowPage(page);
      })
    );
  };




  loadStrategyDetails(strategyId: number): void {
    this.estrategiaService.getStrategy(strategyId)
      .pipe(retry(3))
      .subscribe({
        next: (strategy) => {
          this.strategy = strategy;
          this.syncFormValues();
          console.log('Estratégia carregada:', strategy);
          this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Estratégias', url: '/estrategias', isActive: false },
            { label: strategy.name || 'Estratégia', url: `/estrategia/${this.estrategiaId}`, isActive: true }
          ]);

          // COMPONENTE PAI: Remove breadcrumbs filhos quando volta ao foco somente se necessário
          const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
          if (currentBreadcrumbs.length > 3) { // Só remove se tiver mais que [Início, Estratégias, Estratégia Atual]
            this.breadcrumbService.removeChildrenAfter(`/estrategia/${this.estrategiaId}`);
          }
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes da estratégia:', err);
          this.router.navigate(['/estrategias']);
        }
      });
  }

  private syncFormValues(): void {
    this.strategyName = this.strategy.name || '';
    this.strategyDescription = this.strategy.description || '';
  }

  private sanitizeStrategyData(strategy: any): Strategy {
    return {
      id: strategy.id,
      name: strategy.name || '',
      description: strategy.description || '',
      status: strategy.status || StrategyStatusEnum.ACTIVE,
      activeObjectivesCount: strategy.activeObjectivesCount || 0,
      disabled: strategy.disabled || false,
      createdAt: strategy.createdAt,
      lastModifiedAt: strategy.lastModifiedAt
    };
  }

  // Métodos para salvar campos individuais
  saveStrategyName(): void {
    this.updateStrategyField('name', this.strategyName);
  }

  saveStrategyDescription(): void {
    this.updateStrategyField('description', this.strategyDescription);
  }

  private updateStrategyField(fieldName: string, value: string): void {
    const sanitizedStrategy = this.sanitizeStrategyData({
      ...this.strategy,
      [fieldName]: value
    });

    this.estrategiaService.updateStrategy(this.strategy.id!, sanitizedStrategy)
      .pipe(retry(3))
      .subscribe({
        next: (updatedStrategy) => {
          this.strategy = updatedStrategy;
          this.syncFormValues();
          console.log('Campo atualizado com sucesso');
        },
        error: (err) => {
          console.error('Erro ao salvar:', err);
          alert('Erro ao salvar. Tente novamente.');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/estrategias']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  openCreateModal(tab?: string): void {
    const active = tab || this.activeTab;
    this.currentFormConfig = this.formConfigs[active];
    this.currentFormConfig.fields.forEach((field: any) => {
      field.value = '';
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCreateModal = true;

  }
  createCriteriaGroup(newGroup: CriteriaGroup): void {
    this.criterioService.createCriterio(newGroup, this.estrategiaId).subscribe({
      next: (createdGroup) => {


        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Erro ao criar grupo de critérios:', err);
      }
    });
  }

  // UPDATE
  updateEstrategia(group: CriteriaGroup): void {
    if (!group.id) {

      return;
    }
    this.criterioService.updateCriterio(group.id, this.estrategiaId, group).subscribe({
      next: (updatedGroup) => {

      },
      error: (err) => {
        console.error('Erro ao atualizar grupo de critérios:', err);
      }
    });
  }

  // DELETE
  deleteEstrategia(groupId: number): void {
    this.criterioService.deleteCriterio(groupId, this.estrategiaId).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Erro ao deletar grupo de critérios:', err);
      }
    });
  }


  onSaveByActiveTab(fields: any[]): void {
    switch (this.activeTab) {
      case 'objetivos':
        this.onSaveObjective(fields);
        break;
      case 'criterios':
        this.onSaveCriteriaGroup(fields);
        break;
      case 'avaliacoes':
        this.onSaveEvaluation(fields);
        break;
      case 'cenarios':
        this.onSaveScenario(fields);
        break;
      default:
        this.closeCreateModal();
    }
  }

  // Exemplo de métodos para cada aba:
  onSaveObjective(fields: any[]): void {
    const data = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);
    this.objetivoService.createObjective(this.strategy.id!, data).subscribe({
      next: () => {
        this.closeCreateModal();
        if (this.objectivesTableComponent) {
          this.objectivesTableComponent.refresh();
        }
      },
      error: (err) => {
        console.error('Erro ao criar objetivo:', err);
      }
    });
  }

  onSaveCriteriaGroup(fields: any[]): void {
    const groupData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    const newGroup: CriteriaGroup = {
      name: groupData.name,
      description: groupData.description
    };


    this.criterioService.createCriterio(newGroup, this.estrategiaId).subscribe({
      next: (createdGroup) => {
        this.closeCreateModal();
        if (this.criteriaTableComponent) {
          this.criteriaTableComponent.refresh();
        }
      },
      error: (err) => {
        console.error('Erro ao criar grupo de critérios:', err);
      }
    });
  }

  onSaveEvaluation(fields: any[]): void {
    const data = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);
    this.closeCreateModal();
  }

  onSaveScenario(fields: any[]): void {
    const data = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);
    this.closeCreateModal();
  }



  onSearchCriterios(): void {
    let filtered = [...this.criteriaGroups];
    filtered = filtered.filter(criterio =>
      criterio.name.toLowerCase().includes(this.criteriaSearchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
  }



  closeCreateModal(): void {
    this.showCreateModal = false;
  }
  // Criteria methods
  onCriteriaSearchChange(): void {
    this.onSearchCriterios()
  }

  applyCriteriaFilters(): void {
    let filtered = [...this.criteriaGroups]

    if (this.criteriaSearchTerm) {
      filtered = filtered.filter(
        (criteria) =>
          criteria.name.toLowerCase().includes(this.criteriaSearchTerm.toLowerCase())
      )
    }

    this.filteredCriteriaGroups = filtered
  }

  openCriteriaGroup(criteriaGroupId: number | { id: number }): void {
    let id: number | undefined;
    if (typeof criteriaGroupId === 'object' && criteriaGroupId !== null && 'id' in criteriaGroupId) {
      id = (criteriaGroupId as { id: number }).id;
    } else if (typeof criteriaGroupId === 'number') {
      id = criteriaGroupId;
    }
    if (id) {
      this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', id]);
    } else {
      console.warn('ID da estratégia não encontrado:', criteriaGroupId);
    }
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


  openObjectiveModal(objectiveId?: number): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, 'objetivo', objectiveId]);
  }
  editStrategy() {
    this.openEditModal();
  }

  cancelStrategy() {
    this.openCancelModal();
  }

  deleteStrategy() {
    if (confirm('Tem certeza que deseja excluir esta estratégia? Esta ação não pode ser desfeita.')) {
      this.estrategiaService.deleteStrategy(this.strategy.id!)
        .pipe(retry(3))
        .subscribe({
          next: () => {
            console.log('Estratégia deletada com sucesso');
            alert('Estratégia deletada com sucesso');
            this.router.navigate(['/estrategias']);
          },
          error: (err) => {
            console.error('Erro ao deletar estratégia:', err);
            alert('Erro ao deletar a estratégia. Tente novamente.');
          }
        });
    }
  }

  // Métodos dos modais
  openEditModal(): void {
    this.editStrategyConfig.fields[0].value = this.strategy.name || '';
    this.editStrategyConfig.fields[1].value = this.strategy.description || '';

    this.editStrategyConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openCancelModal(): void {
    this.cancelStrategyConfig.fields[0].value = '';
    this.cancelStrategyConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  onSaveStrategyEdit(fields: FormField[]): void {
    const strategyData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    const updatedStrategy = {
      ...this.strategy,
      name: strategyData.name,
      description: strategyData.description
    };

    const sanitizedStrategy = this.sanitizeStrategyData(updatedStrategy);

    console.log('Dados da estratégia a serem atualizados:', sanitizedStrategy);

    this.estrategiaService.updateStrategy(this.strategy.id!, sanitizedStrategy)
      .pipe(retry(3))
      .subscribe({
        next: (updatedStrategy) => {
          console.log('Estratégia alterada:', updatedStrategy);
          this.loadStrategyDetails(this.strategy.id!);
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Erro ao alterar estratégia:', err);
          console.error('Detalhes do erro:', err.error);
        }
      });
  }

  onCancelStrategy(fields: FormField[]): void {
    const cancelReason = fields.find(f => f.id === 'reason')?.value || '';

    this.estrategiaService.cancelStrategy(this.strategy.id!, { cancellationReason: cancelReason })
      .pipe(retry(3))
      .subscribe({
        next: (updatedStrategy) => {
          this.closeCancelModal();
          this.loadStrategyDetails(this.strategy.id!);
          setTimeout(() => {
            this.router.navigate(['/estrategias']);
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao cancelar estratégia:', err);
        }
      });
  }


  // Verifica se a estratégia está inativa
  isInactive(): boolean {
    return this.strategy?.status === StrategyStatusEnum.INACTIVE;
  }

  // Ativa a estratégia
  onActivateStrategy(): void {
    if (!this.strategy) return;
    if (this.strategy.status !== StrategyStatusEnum.INACTIVE) return;
    const updatedStrategy = {
      ...this.strategy,
      status: StrategyStatusEnum.ACTIVE
    };
    const sanitizedStrategy = this.sanitizeStrategyData(updatedStrategy);
    this.estrategiaService.updateStrategy(this.strategy.id!, sanitizedStrategy)
      .pipe(retry(3))
      .subscribe({
        next: (updatedStrategy) => {
          this.loadStrategyDetails(this.strategy.id!);
        },
        error: (err) => {
          alert('Erro ao ativar a estratégia. Tente novamente.');
        }
      });
  }
  getAvalicoesCoutntPorId(groupId: number): number {
    const group = this.criteriaGroups.find(g => g.id === groupId);
    // console.log('Group:', group);
    // console.log('Group criteria comparisons:', group?.relatedEvaluationGroupsCount);
    return group?.relatedEvaluationGroupsCount || 0;
  }
  getStatusLabelByDisabled(status?: CriteriaGroupStatusEnum): string {
    if (!status) return 'Desconhecido';

    switch (status) {
      case CriteriaGroupStatusEnum.ACTIVE:
        return 'Ativado';
      case CriteriaGroupStatusEnum.INACTIVE:
        return 'Desativado';
      default:
        return 'Desconhecido';
    }
  }

  getStatusColorByDisabled(status?: CriteriaGroupStatusEnum): string {
    if (!status) return 'gray';

    switch (status) {
      case CriteriaGroupStatusEnum.ACTIVE:
        return 'green';
      case CriteriaGroupStatusEnum.INACTIVE:
        return 'red';
      default:
        return 'gray';
    }
  }

  getStrategyStatusLabel(status?: StrategyStatusEnum): string {
    if (!status) return 'Desconhecido';

    switch (status) {
      case StrategyStatusEnum.ACTIVE:
        return 'ATIVO';
      case StrategyStatusEnum.INACTIVE:
        return 'INATIVO';
      default:
        return 'Desconhecido';
    }
  }

  getStrategyStatusColor(status?: StrategyStatusEnum): string {
    if (!status) return 'gray';

    switch (status) {
      case StrategyStatusEnum.ACTIVE:
        return 'green';
      case StrategyStatusEnum.INACTIVE:
        return 'red';
      default:
        return 'gray';
    }
  }
  public parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second = '0'] = timePart.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  }

}
