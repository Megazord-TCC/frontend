import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CriterioService } from '../../../service/criterio.service';
import { Criterion, ImportanceScale } from '../../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';

@Component({
  selector: 'app-criterio',
   imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    FormModalComponentComponent
  ],
  templateUrl: './criterio.component.html',
  styleUrl: './criterio.component.scss'
})
export class CriterioComponent {

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

  selectedImportanceScale: ImportanceScale = ImportanceScale.EQUALLY_IMPORTANT;
  comparisonValues: { [key: number]: { [key: number]: ImportanceScale } } = {};
  importanceScales = Object.values(ImportanceScale);

  importanceScaleMap: { [key in ImportanceScale]: string } = {
    [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: 'Extremamente mais importante',
    [ImportanceScale.MUCH_MORE_IMPORTANT]: 'Muito mais importante',
    [ImportanceScale.MORE_IMPORTANT]: 'Mais importante',
    [ImportanceScale.EQUALLY_IMPORTANT]: 'É tão importante quanto',
    [ImportanceScale.LESS_IMPORTANT]: 'Menos importante',
    [ImportanceScale.MUCH_LESS_IMPORTANT]: 'Muito menos importante',
  };
  showEditModal = false;
  showDeleteModal = false;
  estrategiaId!: number;
  criteriaGroupId!: number;
  criteriaId!: number;
  loadingCriterios = false;
  criteriaGroups: Criterion[] = []
  filteredCriteriaGroups: Criterion[] = []
  activeTab = "diretas"
  criteria?: Criterion;
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private criterioService: CriterioService
  ) {}

  ngOnInit(): void {
    const estrategiaIdParam = this.route.snapshot.paramMap.get('estrategiaId');
    this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
    const grupoIdParam = this.route.snapshot.paramMap.get('grupoId');
    this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;
    const criteriaId = this.route.snapshot.paramMap.get('criterioId');
    this.criteriaId = criteriaId ? Number(criteriaId) : 0;
    this.loadCriteria();
    this.loadAllGroupCriteria();

  }
  async loadCriteria(): Promise<void> {
    this.loadingCriterios = true;
    try {
      const criterio = await firstValueFrom(this.criterioService.getCriterioById(this.criteriaGroupId,this.criteriaId,this.estrategiaId));
      this.criteria = criterio;
      this.loadingCriterios = false;
      console.log('Critérios:', criterio);
    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingCriterios = false;
    }
  }
  async loadAllGroupCriteria(): Promise<void> {
    this.loadingCriterios = true;
    try {
      const criteriaGroup = await firstValueFrom(this.criterioService.getAllCriterios(this.estrategiaId, this.criteriaGroupId));
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;

      // Inicializa comparisonValues
      criteriaGroup.forEach(crit => {
        criteriaGroup.forEach(otherCrit => {
          if (crit.id !== otherCrit.id) {
            this.setComparisonValue(crit.id, otherCrit.id, ImportanceScale.EQUALLY_IMPORTANT);
          }
        });
      });

      this.loadingCriterios = false;
    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingCriterios = false;
    }
  }
  goBack(): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', this.criteriaGroupId,]);
  }
  editCriteria() {
    if (this.criteria) {
      this.editFormConfig.fields.forEach((field: any) => {
        if (field.id === 'name') {
          field.value = this.criteria?.name;
        }
        if (field.id === 'description') {
          field.value = this.criteria?.description;
        }
      });
    }
    this.showEditModal = true;
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }
  deleteCriteria() {
    this.showDeleteModal = true;
  }
  onSearchChange(): void {
    let filtered = [...this.criteriaGroups];
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
  }
  onImportanceChange(criteria: Criterion, otherCriteria: Criterion) {
    if (!criteria?.id || !otherCriteria?.id) return;

    const requestBody = {
      comparedCriterionId: otherCriteria.id,
      referenceCriterionId: criteria.id,
      importanceScale: this.comparisonValues[criteria.id][otherCriteria.id],
      criteriaGroupId: this.criteriaGroupId
    };

    // Aqui você faria a chamada para salvar a comparação
    console.log('Saving comparison:', requestBody);

  }
  getOtherCriteria(): Criterion[] {
    if (!this.criteria || !this.filteredCriteriaGroups) return [];
    return this.filteredCriteriaGroups.filter(c => c.id !== this.criteria?.id);
  }
  getComparisonValue(criteriaId: number, otherCriteriaId: number): ImportanceScale {
    if (!this.comparisonValues[criteriaId]) {
      this.comparisonValues[criteriaId] = {};
    }
    if (this.comparisonValues[criteriaId][otherCriteriaId] === undefined) {
      this.comparisonValues[criteriaId][otherCriteriaId] = ImportanceScale.EQUALLY_IMPORTANT;
    }
    return this.comparisonValues[criteriaId][otherCriteriaId];
  }

  setComparisonValue(criteriaId: number, otherCriteriaId: number, value: ImportanceScale): void {
    if (!this.comparisonValues[criteriaId]) {
      this.comparisonValues[criteriaId] = {};
    }
    this.comparisonValues[criteriaId][otherCriteriaId] = value;
  }

}
