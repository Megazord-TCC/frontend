import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { CriteriaGroup, EvaluationGroup, Objective, Scenario,FormField, Criterion, ImportanceScale, CriteriaComparison, RoleEnum, User } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { CriteriaGroupService } from '../../../service/criteria-group.service';
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
  strategy: any = {
    id: '11',
    name: 'Estratégia 2024', // Mudei para 2024 que é o que você mencionou
    status: 'ATIVO',
    description: 'Descrição da estratégia.',
    lastUpdate: 'Última alteração realizada por Carlos Bentes em 01/01/2025 14:30'
  };

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

  /*
  criteriaGroups: CriteriaGroup[] = [
    {
      id: 1,
      name: "Grupo de critério 1",
      description: "Descrição do grupo 1",
      disabled: false,
      strategy: {
        id: 1,
        name: "Aumentar lucro V2",
        description: "Estratégia para aumentar lucros",
        disabled: false,
        createdAt: new Date('2023-01-01'),
        lastModifiedAt: new Date('2023-01-02'),
        lastModifiedBy: 1 // ID do usuário
      },
      criteria: [
        {
          id: 1,
          name: "Critério 1.1",
          description: "Descrição do critério 1.1",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion,
        {
          id: 2,
          name: "Critério 1.2",
          description: "Descrição do critério 1.2",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion
      ],
      criteriaComparisons: [
        {
          id: 1,
          comparedCriterion: { id: 1, name: "Critério 1.1" } as Criterion,
          referenceCriterion: { id: 2, name: "Critério 1.2" } as Criterion,
          importanceScale: ImportanceScale.MORE_IMPORTANT,
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as CriteriaComparison
      ],
      createdAt: new Date('2023-01-01'),
      lastModifiedAt: new Date('2023-01-02'),
      lastModifiedBy: { id: 1, name: "Admin", email: "admin@example.com", role: RoleEnum.PMO_ADM } as User
    },
    {
      id: 2,
      name: "Grupo de critério 2",
      description: "Descrição do grupo 2",
      disabled: false,
      strategy: {
        id: 1,
        name: "Aumentar lucro V2",
        description: "Estratégia para aumentar lucros",
        disabled: false,
        createdAt: new Date('2023-01-01'),
        lastModifiedAt: new Date('2023-01-03'),
        lastModifiedBy: 1 // ID do usuário
      },
      criteria: [
        {
          id: 3,
          name: "Critério 2.1",
          description: "Descrição do critério 2.1",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion,
        {
          id: 4,
          name: "Critério 2.2",
          description: "Descrição do critério 2.2",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion
      ],
      criteriaComparisons: [
        {
          id: 2,
          comparedCriterion: { id: 3, name: "Critério 2.1" } as Criterion,
          referenceCriterion: { id: 4, name: "Critério 2.2" } as Criterion,
          importanceScale: ImportanceScale.EQUALLY_IMPORTANT,
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as CriteriaComparison
      ],
      createdAt: new Date('2023-01-01'),
      lastModifiedAt: new Date('2023-01-03'),
      lastModifiedBy: { id: 1, name: "Admin", email: "admin@example.com", role: RoleEnum.PMO_ADM } as User
    }
  ];

  */
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
  loadingProjects = false;

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
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;

      // COMPONENTE PAI: Configurar breadcrumbs base
      console.log('📍 Componente pai: Strategy Detail recarregando');

      // COMPONENTE PAI: Constrói breadcrumbs base UMA VEZ
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Início', url: '/inicio', isActive: false },
        { label: 'Estratégias', url: '/estrategias', isActive: false },
        { label: this.strategy?.name || 'Estratégia 2024', url: `/estrategia/${this.estrategiaId}`, isActive: true }
      ]);

      // COMPONENTE PAI: Remove breadcrumbs filhos quando volta ao foco somente se necessário
      const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
      if (currentBreadcrumbs.length > 3) { // Só remove se tiver mais que [Início, Estratégias, Estratégia Atual]
        this.breadcrumbService.removeChildrenAfter(`/estrategia/${this.estrategiaId}`);
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
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;
      this.loadingProjects = false;

    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingProjects = false;
    }
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

    // Cria o objeto CriteriaGroup (ajuste conforme sua interface)
    const newGroup: CriteriaGroup = {
      name: groupData.name,
      description: groupData.description,
      disabled: false,
      // Adicione outros campos obrigatórios se necessário
    };

    // Chama o service passando o id da estratégia
    this.criterioService.createCriterio(newGroup, this.estrategiaId).subscribe({
      next: (createdGroup) => {
        this.loadGruopCriteria(); // Atualiza a lista
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
  getAvalicoesCoutntPorId(groupId: number): number {
    const group = this.criteriaGroups.find(g => g.id === groupId);
    console.log('Group:', group);
    console.log('Group criteria comparisons:', group?.criteriaComparisonCount);
    return group?.criteriaComparisonCount || 0;
  }
  getStatusLabelByDisabled(disabled: boolean): string {
    return disabled ? 'Desativado' : 'Ativado';
  }
  getStatusColorByDisabled(disabled: boolean): string {
    return disabled ? 'red' : 'green';
  }

}
