import { TableComponent } from '../../components/table/table.component';
import { getColumns as getCriterionColumns, getFilterButtons as getCriterionFilterButtons, getFilterText as getCriterionFilterText, getActionButton as getCriterionActionButton } from './criteria-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { Observable, map } from 'rxjs';
import { mapCriterionPageDtoToCriterionTableRowPage } from '../../mappers/criterion-mappers';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { CriteriaComparison, CriteriaGroup, CriteriaGroupStatusEnum, Criterion, ImportanceScale, Objective, RoleEnum, Strategy, User } from '../../interface/interfacies';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CriterioService } from '../../service/criterio.service';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { EstrategiaService } from '../../service/estrategia.service';

@Component({
  selector: 'app-grupo-criterios',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    TableComponent
  ],
  templateUrl: './grupo-criterios.component.html',
  styleUrl: './grupo-criterios.component.scss'
})
export class GrupoCriteriosComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;
  @ViewChild('tableComponent') tableComponent!: TableComponent;

  createFormConfig: any = {

    title: 'Cadastrar critérios',
    fields: [
      { id: 'name', label: 'Nome', type: 'text', value: '', required: true, placeholder: 'Digite o nome' },
      { id: 'description', label: 'Descrição', type: 'textarea', value: '', required: false, placeholder: 'Digite a descrição', rows: 4 }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  editFormConfig: any = {
    title: 'Editar grupo de critérios',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição',
        rows: 4
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.',
    buttons: [
      { id: 'cancel', label: 'Cancelar', type: 'button', variant: 'secondary' },
      { id: 'save', label: 'Salvar', type: 'submit', variant: 'primary' }
    ]
  };

  estrategiaId:number = 0;
  criteriaGroupId:number = 0;
  showCreateModal = false;
  showEditModal = false;
  // showDeleteModal removido, não há mais modal de confirmação
  loadingProjects = false;
  allObjectives: Criterion[] = []
  criteriaGroups: Criterion[] = []
  filteredCriteriaGroups: Criterion[] = []
  criteriaGroup?: CriteriaGroup;
  searchTerm = '';
  // Propriedades para o app-table de critérios
  criterionColumns = getCriterionColumns();
  criterionFilterButtons = []; //getCriterionFilterButtons(); // Remove filtros pois na página de critérios não há status. 
  criterionFilterText = getCriterionFilterText();
  criterionActionButton = getCriterionActionButton();

  readonly strategyService = inject(EstrategiaService);
  strategy: Strategy | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly criterioService: CriterioService,
    private readonly criterioGroupService: CriteriaGroupService,
    private readonly breadcrumbService: BreadcrumbService
  ) {}

  private updateBreadcrumbs(): void {
    const strategyName = this.strategy?.name;
    const groupName = this.criteriaGroup?.name;
    let groupLabel = 'Grupo de critérios';
    if (groupName) {
      groupLabel = `Grupo de critérios: ${groupName}`;
    } else if (this.criteriaGroupId) {
      groupLabel = `Grupo ${this.criteriaGroupId}`;
    }

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Estratégias', url: '/estrategias', isActive: false },
      { label: strategyName ? `Estratégia: ${strategyName}` : 'Estratégia', url: `/estrategia/${this.estrategiaId}`, isActive: false },
      { label: groupLabel, url: `/estrategia/${this.estrategiaId}/grupo-criterio/${this.criteriaGroupId}`, isActive: true }
    ]);
  }
  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
  const grupoIdParam = params.get('grupoId');
  this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;

      this.getStrategyById(this.estrategiaId);
      this.loadGruopCriteriaById();
    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  // Método de busca para o app-table de critérios
  getDataForCriteriaTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
    return this.criterioService.getCriteriaPage(this.estrategiaId, this.criteriaGroupId, queryParams).pipe(
      map((page: Page<any>) => {
        console.log('[getDataForCriteriaTable] page:', page);
        return mapCriterionPageDtoToCriterionTableRowPage(page);
      })
    );
  };
  getStrategyById(estrategiaId: number): void {
    this.strategyService.getStrategyById(estrategiaId)
      .subscribe(strategy => {
        this.strategy = strategy;
        this.updateBreadcrumbs();
      });
  }

  async loadGruopCriteriaById(): Promise<void> {
    try {
      const criteriaGroup = await firstValueFrom(this.criterioGroupService.getCriterioById(this.criteriaGroupId,this.estrategiaId));
      this.criteriaGroup = criteriaGroup;
      console.log('Grupo de critérios carregado:', this.criteriaGroup);
      this.updateBreadcrumbs();

    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
    }
  }

  goBack(): void {
    // Remover o breadcrumb do grupo antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.estrategiaId}/grupo-criterio/${this.criteriaGroupId}`);
    this.router.navigate([`/estrategia`, this.estrategiaId]);
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
  editCriteriaGroup() {
    if (this.criteriaGroup) {
      for (const field of this.editFormConfig?.fields ?? []) {
        if (field.id === 'name') {
          field.value = this.criteriaGroup?.name;
        }
        if (field.id === 'description') {
          field.value = this.criteriaGroup?.description;
        }
      }
    }
    this.showEditModal = true;
  }


  async deleteCriteriaGroup() {
    try {
      const group = await firstValueFrom(this.criterioGroupService.getCriterioById(this.criteriaGroupId, this.estrategiaId));
      if (group.relatedEvaluationGroupsCount && group.relatedEvaluationGroupsCount > 0) {
        alert('Este grupo de critérios está atrelado a um grupo de avaliação e não pode ser excluído.');
        return;
      }
      // Excluir diretamente e voltar para estratégias
      await firstValueFrom(this.criterioGroupService.deleteCriterio(this.criteriaGroupId, this.estrategiaId));
      this.goBack();
    } catch (err) {
      alert('Erro ao excluir grupo de critérios.');
      console.error('Erro ao excluir grupo de critérios:', err);
    }
  }
  openCreateModal(tab?: string): void {

    this.showCreateModal = true;

  }

  onSearchChange(): void {
    let filtered = [...this.allObjectives];
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
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
  closeCreateModal(): void {
    this.showCreateModal = false;
  }
  closeEditModal(): void {
    this.showEditModal = false;
  }
  // closeDeleteModal removido, não há mais modal de confirmação

  onSaveByActiveTab(fields: any[]): void {
    const groupData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    if (this.showCreateModal) {
      // Criação de critério
      this.criterioService.createCriterio(groupData, this.estrategiaId, this.criteriaGroupId).subscribe({
        next: () => {

          this.closeCreateModal();
          if (this.tableComponent) {
            this.tableComponent.refresh();
          }
          this.resetFormFields(this.createFormConfig);
        },
        error: (err) => {
          console.error('Erro ao criar critério:', err);
        }
      });
    } else if (this.showEditModal) {

      if (this.criteriaGroup) {
        const updatedGroup: CriteriaGroup = {
          ...this.criteriaGroup,
          name: groupData.name,
          description: groupData.description
        };

        this.criterioGroupService.updateCriterio(this.criteriaGroupId, this.estrategiaId, updatedGroup).subscribe({
          next: () => {
            this.loadGruopCriteriaById();
            this.closeEditModal();
            this.resetFormFields(this.editFormConfig);
          },
          error: (err) => {
            console.error('Erro ao editar grupo de critérios:', err);
          }
        });
      }

    // ...não há mais fluxo de exclusão via modal...
    }

  }

  // Move resetFormFields outside of onSaveByActiveTab as a class method
  resetFormFields(formConfig: any): void {
    for (const field of formConfig?.fields ?? []) {
      field.value = '';
    }
  }

  formatWeightAsPercentage(weight: number | null | undefined): string {
    // Verifica se o valor é válido
    if (weight == null || weight === undefined || Number.isNaN(weight)) {
      return '0%';
    }

    // Converte para percentual e arredonda
    const percentage = Math.round(weight * 100);

    // Garante que não seja negativo nem maior que 100%
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return clampedPercentage + '%';
  }
}
