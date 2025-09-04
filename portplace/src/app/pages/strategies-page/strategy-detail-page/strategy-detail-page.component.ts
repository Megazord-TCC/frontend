import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { CriteriaGroup, EvaluationGroup, Objective, Scenario, FormField, Criterion, ImportanceScale, CriteriaComparison, RoleEnum, User, CriteriaGroupStatusEnum, Strategy, StrategyStatusEnum, FormModalConfig } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { CriteriaGroupService } from '../../../service/criteria-group.service';
import { EstrategiaService } from '../../../service/estrategia.service';
import { firstValueFrom, retry, Subscription } from 'rxjs';
import { EvaluationGroupsTabComponent } from '../../../components/evaluation-groups-tab/evaluation-groups-tab.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { ScenarioTabComponent } from '../../../components/scenario-tab/scenario-tab.component';


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
    ScenarioTabComponent
  ],
  templateUrl: './strategy-detail-page.component.html',
  styleUrl: './strategy-detail-page.component.scss'
})
export class StrategyDetailPageComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;
  strategy: Strategy = {
    name: 'Carregando...',
    description: 'Carregando descrição...'
  };

  // Campos editáveis para binding com inputs
  strategyName: string = '';
  strategyDescription: string = '';

  objectives: Objective[] = [
    {
      id: 1,
      name: 'Aumentar lucro',
      disabled: false,
      description: 'Aumentar o lucro da empresa em 20%',
      strategyId: 1,
      status: 'ATIVADO',
      statusColor: 'green',
      createdAt: '2023-01-01T00:00:00Z',
      lastModifiedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Capacitar empregados',
      disabled: false,
      description: 'Capacitar os empregados da empresa',
      strategyId: 1,
      status: 'CANCELADO',
      statusColor: 'gray',
      createdAt: '2023-01-01T00:00:00Z',
      lastModifiedAt: '2023-01-01T00:00:00Z'
    }
  ];
  evaluationGroups: EvaluationGroup[] = [

  ]

  scenarios: Scenario[] = [
    {
      id: "1",
      name: "CAIXA libera empréstimo",
      budget: "R$ 1.000.000,00",
      evaluation: "Avaliação 2",
      selectedProjects: 8,
      status: "AGUARDANDO AUTORIZAÇÃO",
      statusColor: "yellow",
    },
    {
      id: "2",
      name: "CAIXA não libera empréstimo",
      budget: "R$ 500.000,00",
      evaluation: "Avaliação 2",
      selectedProjects: 3,
      status: "AUTORIZADO",
      statusColor: "green",
    },
    {
      id: "3",
      name: "Contratos 2026 não são fechados",
      budget: "R$ 200.000,00",
      evaluation: "Avaliação 1",
      selectedProjects: 2,
      status: "CANCELADO",
      statusColor: "gray",
    },
  ]
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
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;

      // COMPONENTE PAI: Configurar breadcrumbs base
      console.log('📍 Componente pai: Strategy Detail recarregando');

      if (this.estrategiaId) {
        this.loadStrategyDetails(this.estrategiaId);
      }

      // Carregar dados
      this.filteredObjectives = [...this.objectives];
      this.loadGruopCriteria();
      this.filteredEvaluationGroups = [...this.evaluationGroups];
      this.filteredScenarios = [...this.scenarios];
    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadGruopCriteria(): Promise<void> {
    this.loadingProjects = true;
    try {
      const criteriaGroup = await firstValueFrom(this.criterioService.getAllCriterios(this.estrategiaId));
      console.log('Grupo de critérios carregados:', criteriaGroup);
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;
      this.loadingProjects = false;

    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingProjects = false;
    }
  }

  loadStrategyDetails(strategyId: number): void {
    this.estrategiaService.getStrategy(strategyId)
      .pipe(retry(3))
      .subscribe({
        next: (strategy) => {
          this.strategy = strategy;
          this.syncFormValues();

          // COMPONENTE PAI: Constrói breadcrumbs base UMA VEZ
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

        this.loadGruopCriteria();
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
        this.loadGruopCriteria();
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
        this.loadGruopCriteria();
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
    this.closeCreateModal();
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
        this.loadGruopCriteria();
        this.closeCreateModal();
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

  onSearchObjectives(): void {
    let filtered = [...this.objectives];
    filtered = filtered.filter(objective =>
      objective.name.toLowerCase().includes(this.objectiveSearchTerm.toLowerCase())
    );
    this.filteredObjectives = filtered;
  }

  onSearchCriterios(): void {
    let filtered = [...this.criteriaGroups];
    filtered = filtered.filter(criterio =>
      criterio.name.toLowerCase().includes(this.criteriaSearchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
  }

  onSearchAvaliacoes(): void {
    let filtered = [...this.evaluationGroups];
    filtered = filtered.filter(avaliacao =>
      avaliacao.name.toLowerCase().includes(this.evaluationSearchTerm.toLowerCase())
    );
    this.filteredEvaluationGroups = filtered;
  }

  onSearchCenarios(): void {
    let filtered = [...this.scenarios];
    filtered = filtered.filter(cenario =>
      cenario.name.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase())
    );
    this.filteredScenarios = filtered;
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

  openCriteriaGroup(criteriaGroupId?: number): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', criteriaGroupId]);

  }

  // Evaluation methods
  onEvaluationSearchChange(): void {
    this.onSearchAvaliacoes()
  }

  applyEvaluationFilters(): void {
    let filtered = [...this.evaluationGroups]

    if (this.evaluationSearchTerm) {
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.name.toLowerCase().includes(this.evaluationSearchTerm.toLowerCase())
      )
    }

    this.filteredEvaluationGroups = filtered
  }

  openEvaluationModal(evaluation?: EvaluationGroup): void {
    console.log("Opening evaluation modal", evaluation)
    // Implementar modal de avaliação
  }

  // Scenario methods
  onScenarioFilterChange(filter: string): void {
    this.scenarioFilter = this.scenarioFilter === filter ? "" : filter
    this.applyScenarioFilters()
  }

  onScenarioSearchChange(): void {
    this.applyScenarioFilters()
  }

  applyScenarioFilters(): void {
    let filtered = [...this.scenarios]

    if (this.scenarioFilter) {
      filtered = filtered.filter((scenario) => {
        const status = scenario.status.toLowerCase()
        if (this.scenarioFilter === "aguardando") {
          return status.includes("aguardando")
        }
        return status.includes(this.scenarioFilter.toLowerCase())
      })
    }

    if (this.scenarioSearchTerm) {
      filtered = filtered.filter((scenario) =>
        scenario.name.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase()),
      )
    }

    this.filteredScenarios = filtered
  }

  openScenarioModal(scenario?: Scenario): void {
    console.log("Opening scenario modal", scenario)
    // Implementar modal de cenário
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
    this.onSearchObjectives();
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

    const updatedStrategy = {
      ...this.strategy,
      status: StrategyStatusEnum.INACTIVE,
      description: `${this.strategy.description || ''}\n\nRazão do cancelamento: ${cancelReason}`
    };

    const sanitizedStrategy = this.sanitizeStrategyData(updatedStrategy);

    this.estrategiaService.updateStrategy(this.strategy.id!, sanitizedStrategy)
      .pipe(retry(3))
      .subscribe({
        next: (updatedStrategy) => {
          console.log('Estratégia cancelada com sucesso:', updatedStrategy);
          this.closeCancelModal();
          this.loadStrategyDetails(this.strategy.id!);
          alert('Estratégia cancelada com sucesso');
          setTimeout(() => {
            this.router.navigate(['/estrategias']);
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao cancelar estratégia:', err);
          console.error('Detalhes do erro:', err.error);
          alert('Erro ao cancelar a estratégia. Tente novamente.');
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

}
