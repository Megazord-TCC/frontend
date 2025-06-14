import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CriterioService } from '../../../service/criterio.service';
import { Criterion, ImportanceScale, CriteriaComparison } from '../../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GrupoCriterioService } from '../../../service/criteria-group-comparations.service';

@Component({
  selector: 'app-criterio',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    FormModalComponentComponent,
    NgSelectModule
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
  comparisonValues: { [key: number]: { [key: number]: ImportanceScale | string } } = {};

  // NOVO: Mapa de inversão para lógica bidirecional
  importanceScaleInverseMap: { [key in ImportanceScale]: ImportanceScale } = {
    [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: ImportanceScale.MUCH_LESS_IMPORTANT,
    [ImportanceScale.MUCH_MORE_IMPORTANT]: ImportanceScale.MUCH_LESS_IMPORTANT,
    [ImportanceScale.MORE_IMPORTANT]: ImportanceScale.LESS_IMPORTANT,
    [ImportanceScale.EQUALLY_IMPORTANT]: ImportanceScale.EQUALLY_IMPORTANT,
    [ImportanceScale.LESS_IMPORTANT]: ImportanceScale.MORE_IMPORTANT,
    [ImportanceScale.MUCH_LESS_IMPORTANT]: ImportanceScale.MUCH_MORE_IMPORTANT
  };

  importanceScales = [
    { value: ImportanceScale.EXTREMELY_MORE_IMPORTANT, label: 'Extremamente mais importante' },
    { value: ImportanceScale.MUCH_MORE_IMPORTANT, label: 'Muito mais importante' },
    { value: ImportanceScale.MORE_IMPORTANT, label: 'Mais importante' },
    { value: ImportanceScale.EQUALLY_IMPORTANT, label: 'É tão importante quanto' },
    { value: ImportanceScale.LESS_IMPORTANT, label: 'Menos importante' },
    { value: ImportanceScale.MUCH_LESS_IMPORTANT, label: 'Muito menos importante' }
  ];

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
  existingComparisons: CriteriaComparison[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private criterioService: CriterioService,
    private criteriaGroupComparationsService: GrupoCriterioService
  ) {}

  ngOnInit(): void {
    const estrategiaIdParam = this.route.snapshot.paramMap.get('estrategiaId');
    this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
    const grupoIdParam = this.route.snapshot.paramMap.get('grupoId');
    this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;
    const criteriaId = this.route.snapshot.paramMap.get('criterioId');
    this.criteriaId = criteriaId ? Number(criteriaId) : 0;

    this.loadCriteria();
    this.loadAllGroupCriteria().then(() => {
      // Carregar comparações após carregar critérios
      this.loadExistingComparisons();
    });
  }

  async loadCriteria(): Promise<void> {
    this.loadingCriterios = true;
    try {
      const criterio = await firstValueFrom(this.criterioService.getCriterioById(this.criteriaGroupId, this.criteriaId, this.estrategiaId));
      this.criteria = criterio;
      this.loadingCriterios = false;
      console.log('Critérios:', criterio);
    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingCriterios = false;
    }
  }

  async loadExistingComparisons(): Promise<void> {
    try {
      const comparisons = await firstValueFrom(
        this.criteriaGroupComparationsService.getCriteriaComparisons(this.estrategiaId, this.criteriaGroupId)
      );
      this.existingComparisons = comparisons || [];

      // Inicializar comparisonValues com dados existentes
      this.initializeComparisonValues();

      console.log('Avaliações carregadas:', comparisons);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
      this.existingComparisons = [];
      // Inicializar mesmo com erro
      this.initializeComparisonValues();
    }
  }

  // NOVO: Método para buscar comparação bidirecional
  getBidirectionalComparison(criteriaId: number, otherCriteriaId: number): {
    comparison: CriteriaComparison | undefined,
    isInverted: boolean
  } {
    // Primeiro, procurar comparação direta (criteriaId comparado com otherCriteriaId)
    let comparison = this.existingComparisons.find(c =>
      c.comparedCriterionId === criteriaId && c.referenceCriterionId === otherCriteriaId
    );

    if (comparison) {
      return { comparison, isInverted: false };
    }

    // Se não encontrar direta, procurar inversa (otherCriteriaId comparado com criteriaId)
    comparison = this.existingComparisons.find(c =>
      c.comparedCriterionId === otherCriteriaId && c.referenceCriterionId === criteriaId
    );

    if (comparison) {
      return { comparison, isInverted: true };
    }

    return { comparison: undefined, isInverted: false };
  }

  // MODIFICADO: Método para inicializar valores com lógica bidirecional
  initializeComparisonValues(): void {
    if (!this.criteria || !this.filteredCriteriaGroups) return;

    this.getOtherCriteria().forEach(otherCriteria => {
      if (!this.comparisonValues[this.criteria!.id]) {
        this.comparisonValues[this.criteria!.id] = {};
      }

      // NOVO: Buscar avaliação bidirecional
      const { comparison, isInverted } = this.getBidirectionalComparison(this.criteria!.id, otherCriteria.id);

      if (comparison) {
        if (isInverted) {
          // Se é uma comparação inversa, mostrar o valor mapeado
          const mappedScale = this.importanceScaleInverseMap[comparison.importanceScale];
          this.comparisonValues[this.criteria!.id][otherCriteria.id] = mappedScale;
        } else {
          // Se é uma comparação direta, mostrar o valor original
          this.comparisonValues[this.criteria!.id][otherCriteria.id] = comparison.importanceScale;
        }
      } else {
        // Se não existe nenhuma comparação, mostrar placeholder
        this.comparisonValues[this.criteria!.id][otherCriteria.id] = '';
      }
    });

    console.log('ComparisonValues inicializados:', this.comparisonValues);
  }

  // MODIFICADO: Método para buscar avaliação existente (mantido para compatibilidade)
  getExistingComparison(comparedCriterionId: number, referenceCriterionId: number): CriteriaComparison | undefined {
    const { comparison } = this.getBidirectionalComparison(comparedCriterionId, referenceCriterionId);
    return comparison;
  }

  // MODIFICADO: Método para mudança de importância com lógica bidirecional
  async onImportanceChange(criteria: Criterion, otherCriteria: Criterion): Promise<void> {
    if (!criteria?.id || !otherCriteria?.id) return;

    const selectedValue = this.comparisonValues[criteria.id][otherCriteria.id];

    // Se for string vazia, não processar
    if (selectedValue === '' || selectedValue === undefined) {
      return;
    }

    try {
      // NOVO: Verificar se já existe uma avaliação bidirecional
      const { comparison, isInverted } = this.getBidirectionalComparison(criteria.id, otherCriteria.id);

      if (comparison && comparison.id) {
        // Existe uma comparação - fazer UPDATE
        let scaleToSave: ImportanceScale;

        if (isInverted) {
          // Se estamos editando uma comparação inversa, precisamos inverter o valor para salvar
          scaleToSave = this.importanceScaleInverseMap[selectedValue as ImportanceScale];
          console.log('Atualizando comparação inversa:', selectedValue, '->', scaleToSave);
        } else {
          // Se é uma comparação direta, salvar o valor como está
          scaleToSave = selectedValue as ImportanceScale;
          console.log('Atualizando comparação direta:', scaleToSave);
        }

        const requestBodyUpdate = {
          id: comparison.id,
          importanceScale: scaleToSave
        };

        const updatedComparison = await firstValueFrom(
          this.criteriaGroupComparationsService.updateCriteriaComparison(
            requestBodyUpdate,
            comparison.id,
            this.criteriaGroupId,
            this.estrategiaId
          )
        );

        // Atualizar o array local
        if (updatedComparison) {
          const index = this.existingComparisons.findIndex(c => c.id === comparison.id);
          if (index !== -1) {
            this.existingComparisons[index] = updatedComparison;
          }
          console.log('Avaliação atualizada:', updatedComparison);
        } else {
          // Se retornou null, atualizar manualmente o array local
          const index = this.existingComparisons.findIndex(c => c.id === comparison.id);
          if (index !== -1) {
            this.existingComparisons[index] = {
              ...this.existingComparisons[index],
              importanceScale: scaleToSave
            };
          }
          console.log('Update retornou null, mas atualizou localmente');
        }

      } else {
        // NOVO: Não existe comparação em nenhuma direção - fazer CREATE
        const requestBodyCreate = {
          comparedCriterionId: criteria.id,
          referenceCriterionId: otherCriteria.id,
          importanceScale: selectedValue as ImportanceScale,
          criteriaGroupId: this.criteriaGroupId
        };

        console.log('Criando nova comparação:', requestBodyCreate);

        const newComparison = await firstValueFrom(
          this.criteriaGroupComparationsService.createCriteriaComparison(
            requestBodyCreate,
            this.criteriaGroupId,
            this.estrategiaId
          )
        );

        // Adicionar ao array local
        if (newComparison) {
          this.existingComparisons.push(newComparison);
          console.log('Nova avaliação criada:', newComparison);
        } else {
          // Se retornou null, criar objeto local temporário
          const tempComparison: CriteriaComparison = {
            id: Date.now(), // ID temporário
            comparedCriterionId: criteria.id,
            referenceCriterionId: otherCriteria.id,
            importanceScale: selectedValue as ImportanceScale,
            criteriaGroupId: this.criteriaGroupId
          };
          this.existingComparisons.push(tempComparison);
          console.log('Create retornou null, criou objeto local temporário');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      // Reverter o valor no select em caso de erro
      this.comparisonValues[criteria.id][otherCriteria.id] = '';
    }
  }

  // Método para carregar todos os critérios do grupo
  async loadAllGroupCriteria(): Promise<void> {
    this.loadingCriterios = true;
    try {
      const criteriaGroup = await firstValueFrom(
        this.criterioService.getAllCriterios(this.estrategiaId, this.criteriaGroupId)
      );
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;

      this.loadingCriterios = false;
    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingCriterios = false;
    }
  }

  // MODIFICADO: Método helper para verificar se uma comparação já foi avaliada (bidirecional)
  isComparisonEvaluated(comparedCriterionId: number, referenceCriterionId: number): boolean {
    const { comparison } = this.getBidirectionalComparison(comparedCriterionId, referenceCriterionId);
    return !!comparison;
  }

  // MODIFICADO: Método helper para obter o texto da avaliação atual (bidirecional)
  getComparisonText(comparedCriterionId: number, referenceCriterionId: number): string {
    const { comparison, isInverted } = this.getBidirectionalComparison(comparedCriterionId, referenceCriterionId);

    if (!comparison) {
      return 'Avalie';
    }

    const scaleToShow = isInverted ?
      this.importanceScaleInverseMap[comparison.importanceScale] :
      comparison.importanceScale;

    return this.importanceScaleMap[scaleToShow];
  }

  // Método para obter as entradas do enum como array
  getImportanceScaleEntries() {
    return Object.keys(this.importanceScaleMap).map(key => ({
      key: key,
      value: this.importanceScaleMap[key as ImportanceScale]
    }));
  }

  // NOVO: Método para navegar para outro critério
  navigateToCriteria(criteriaId: number): void {
    this.router.navigate([
      '/estrategia',
      this.estrategiaId,
      'grupo-criterio',
      this.criteriaGroupId,
      'criterio',
      criteriaId
    ]);
  }

  goBack(): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', this.criteriaGroupId]);
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

  closeEditModal(): void {
    this.showEditModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  onSaveByActiveTab(fields: any[]): void {
    const criterioData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    if (this.showEditModal) {
      // Edição de critério
      if (this.criteria) {
        const updatedCriterio = {
          ...this.criteria,
          ...criterioData
        };
        this.criterioService.updateCriterio(this.criteria.id, updatedCriterio, this.estrategiaId, this.criteriaGroupId).subscribe({
          next: () => {
            this.loadCriteria();
            this.closeEditModal();
            this.resetFormFields(this.editFormConfig);
          },
          error: (err) => {
            console.error('Erro ao editar critério:', err);
          }
        });
      }
    } else if (this.showDeleteModal) {
      // Exclusão de critério
      if (this.criteria) {
        this.criterioService.deleteCriterio(this.criteria.id, this.estrategiaId, this.criteriaGroupId).subscribe({
          next: () => {
            this.loadCriteria();
            this.closeDeleteModal();
            this.resetFormFields(this.deleteFormConfig);
            this.router.navigate([`/estrategia`, this.estrategiaId, 'grupo-criterio', this.criteriaGroupId]);
          },
          error: (err) => {
            console.error('Erro ao excluir critério:', err);
          }
        });
      }
    }
  }

  resetFormFields(formConfig: any): void {
    if (formConfig && formConfig.fields) {
      formConfig.fields.forEach((field: any) => {
        field.value = '';
      });
    }
  }

  onSearchChange(): void {
    let filtered = [...this.criteriaGroups];
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
  }

  getOtherCriteria(): Criterion[] {
    if (!this.criteria || !this.filteredCriteriaGroups) return [];
    return this.filteredCriteriaGroups.filter(c => c.id !== this.criteria?.id);
  }

  setComparisonValue(criteriaId: number, otherCriteriaId: number, value: ImportanceScale): void {
    if (!this.comparisonValues[criteriaId]) {
      this.comparisonValues[criteriaId] = {};
    }
    this.comparisonValues[criteriaId][otherCriteriaId] = value;
  }

  getFilteredScales(otherCriteria: any): any[] {
    return this.importanceScales.filter(scale => {
      return this.criteria && scale.value !== this.comparisonValues[otherCriteria.id]?.[this.criteria.id];
    });
  }

  // NOVO: Método para obter comparações recíprocas (apenas para visualização) - CORRIGIDO COM DEBUG
  getReciprocalComparisons(): {criteria: Criterion, comparisonText: string, hasComparison: boolean}[] {
    if (!this.criteria || !this.filteredCriteriaGroups) return [];

    console.log('=== DEBUG getReciprocalComparisons ===');
    console.log('Critério atual:', this.criteria.id, this.criteria.name);
    console.log('Comparações existentes:', this.existingComparisons);

    return this.getOtherCriteria().map(otherCriteria => {
      console.log(`\nAnalisando ${otherCriteria.name} (ID: ${otherCriteria.id})`);

      // Buscar qualquer comparação entre os dois critérios
      const directComparison = this.existingComparisons.find(c =>
        c.comparedCriterionId === otherCriteria.id && c.referenceCriterionId === this.criteria!.id
      );

      const inverseComparison = this.existingComparisons.find(c =>
        c.comparedCriterionId === this.criteria!.id && c.referenceCriterionId === otherCriteria.id
      );

      console.log('Comparação direta (other→current):', directComparison);
      console.log('Comparação inversa (current→other):', inverseComparison);

      let comparisonText = 'Não avaliado';
      let hasComparison = false;

      if (directComparison) {
        // otherCriteria comparou com criteria atual
        // Mostrar exatamente como otherCriteria avaliou
        comparisonText = this.importanceScaleMap[directComparison.importanceScale];
        hasComparison = true;
        console.log('Usando comparação direta:', comparisonText);
      } else if (inverseComparison) {
        // criteria atual comparou com otherCriteria
        // Mostrar o inverso (como seria na perspectiva do otherCriteria)
        const invertedScale = this.importanceScaleInverseMap[inverseComparison.importanceScale];
        comparisonText = this.importanceScaleMap[invertedScale];
        hasComparison = true;
        console.log('Usando comparação inversa:', inverseComparison.importanceScale, '→', invertedScale, '→', comparisonText);
      }

      return {
        criteria: otherCriteria,
        comparisonText,
        hasComparison
      };
    });
  }
}
