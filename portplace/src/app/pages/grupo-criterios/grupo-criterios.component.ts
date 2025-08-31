import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { CriteriaComparison, CriteriaGroup, CriteriaGroupStatusEnum, Criterion, ImportanceScale, Objective, RoleEnum, User } from '../../interface/interfacies';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CriterioService } from '../../service/criterio.service';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-grupo-criterios',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent
  ],
  templateUrl: './grupo-criterios.component.html',
  styleUrl: './grupo-criterios.component.scss'
})
export class GrupoCriteriosComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  createFormConfig: any = {
  // Defina aqui a configuração do formulário conforme sua necessidade
  title: 'Cadastrar critérios',
  fields: [
      { id: 'name', label: 'Nome', type: 'text', value: '', required: true, placeholder: 'Digite o nome' },
      { id: 'description', label: 'Descrição', type: 'textarea', value: '', required: false, placeholder: 'Digite a descrição', rows: 4 }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };
  deleteFormConfig: any = {
    title: 'Cancelar grupo de critérios',
    fields: [
      {
        id: 'justification',
        label: 'Justificativa do cancelamento ',
        type: 'textarea',
        value: '',
        required: true,
        placeholder: 'Digite a justificativa para o cancelamento',
        rows: 4
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.',
    buttons: [
      { id: 'cancel', label: 'Cancelar', type: 'button', variant: 'secondary' },
      { id: 'confirm', label: 'Confirmar Cancelamento', type: 'submit', variant: 'danger' }
    ]
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
  showDeleteModal = false;
  loadingProjects = false;
  allObjectives: Criterion[] = []
  criteriaGroups: Criterion[] = []
  filteredCriteriaGroups: Criterion[] = []
  criteriaGroup?: CriteriaGroup;
  searchTerm = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private criterioService: CriterioService,
    private criterioGroupService: CriteriaGroupService,
    private breadcrumbService: BreadcrumbService
  ) {}
  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
      const grupoIdParam = params.get('grupoId');
      this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;

      // COMPONENTE FILHO: Simplesmente carrega dados e adiciona seu breadcrumb
      console.log('📍 Componente filho: Grupo de Critérios inicializando/recarregando');

      this.loadCriteria();
      this.loadGruopCriteriaById();
    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  async loadCriteria(): Promise<void> {
    this.loadingProjects = true;
    try {
      const criteriaGroup = await firstValueFrom(this.criterioService.getAllCriterios(this.estrategiaId, this.criteriaGroupId));
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;
      this.loadingProjects = false;
    } catch (err) {
      this.loadingProjects = false;
    }
  }
  async loadGruopCriteriaById(): Promise<void> {
    try {
      const criteriaGroup = await firstValueFrom(this.criterioGroupService.getCriterioById(this.criteriaGroupId,this.estrategiaId));
      this.criteriaGroup = criteriaGroup;

      // COMPONENTE FILHO: Adiciona seu breadcrumb ao array do pai
      this.breadcrumbService.addChildBreadcrumb({
        label: criteriaGroup.name || `Grupo ${this.criteriaGroupId}`,
        url: `/estrategia/${this.estrategiaId}/grupo-criterio/${this.criteriaGroupId}`,
        isActive: true
      });

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
      this.editFormConfig.fields.forEach((field: any) => {
        if (field.id === 'name') {
          field.value = this.criteriaGroup?.name;
        }
        if (field.id === 'description') {
          field.value = this.criteriaGroup?.description;
        }
      });
    }
    this.showEditModal = true;
  }


  deleteCriteriaGroup() {
    this.showDeleteModal = true;
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
    this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', this.criteriaGroupId,'criterio',criteriaId]);

  }
  closeCreateModal(): void {
    this.showCreateModal = false;
  }
  closeEditModal(): void {
    this.showEditModal = false;
  }
  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onSaveByActiveTab(fields: any[]): void {
    const groupData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    if (this.showCreateModal) {
      // Criação de critério
      this.criterioService.createCriterio(groupData, this.estrategiaId, this.criteriaGroupId).subscribe({
        next: () => {
          this.loadCriteria();
          this.closeCreateModal();
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

    } else if (this.showDeleteModal) {
      // Exclusão do grupo de critérios
      this.criterioGroupService.deleteCriterio(this.criteriaGroupId, this.estrategiaId).subscribe({
        next: () => {
          this.goBack();
          this.closeDeleteModal();
          this.resetFormFields(this.deleteFormConfig);
        },
        error: (err) => {
          console.error('Erro ao excluir grupo de critérios:', err);
        }
      });
    }

  }
  resetFormFields(formConfig: any): void {
    if (formConfig && formConfig.fields) {
      formConfig.fields.forEach((field: any) => {
        field.value = '';
      });
    }
  }
  formatWeightAsPercentage(weight: number | null | undefined): string {
  // Verifica se o valor é válido
  if (weight == null || weight === undefined || isNaN(weight)) {
    return '0%';
  }

  // Converte para percentual e arredonda
  const percentage = Math.round(weight * 100);

  // Garante que não seja negativo nem maior que 100%
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return clampedPercentage + '%';
}
}
