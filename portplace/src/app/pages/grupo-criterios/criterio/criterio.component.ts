import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
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
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';

@Component({
  selector: 'app-criterio',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    NgSelectModule
  ],
  templateUrl: './criterio.component.html',
  styleUrl: './criterio.component.scss'
})
export class CriterioComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

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

  // Mapa de inversão para lógica bidirecional
  importanceScaleInverseMap: { [key in ImportanceScale]: ImportanceScale } = {
    [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: ImportanceScale.EXTREMELY_LESS_IMPORTANT,
    [ImportanceScale.MUCH_MORE_IMPORTANT]: ImportanceScale.MUCH_LESS_IMPORTANT,
    [ImportanceScale.MORE_IMPORTANT]: ImportanceScale.LESS_IMPORTANT,
    [ImportanceScale.EQUALLY_IMPORTANT]: ImportanceScale.EQUALLY_IMPORTANT,
    [ImportanceScale.LESS_IMPORTANT]: ImportanceScale.MORE_IMPORTANT,
    [ImportanceScale.MUCH_LESS_IMPORTANT]: ImportanceScale.MUCH_MORE_IMPORTANT,
    [ImportanceScale.EXTREMELY_LESS_IMPORTANT]: ImportanceScale.EXTREMELY_MORE_IMPORTANT
  };

  importanceScales = [
    { value: ImportanceScale.EXTREMELY_MORE_IMPORTANT, label: 'Extremamente mais importante' },
    { value: ImportanceScale.MUCH_MORE_IMPORTANT, label: 'Muito mais importante' },
    { value: ImportanceScale.MORE_IMPORTANT, label: 'Mais importante' },
    { value: ImportanceScale.EQUALLY_IMPORTANT, label: 'É tão importante quanto' },
    { value: ImportanceScale.LESS_IMPORTANT, label: 'Menos importante' },
    { value: ImportanceScale.MUCH_LESS_IMPORTANT, label: 'Muito menos importante' },
    { value: ImportanceScale.EXTREMELY_LESS_IMPORTANT, label: 'Extremamente menos importante' }
  ];

  importanceScaleMap: { [key in ImportanceScale]: string } = {
    [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: 'Extremamente mais importante',
    [ImportanceScale.MUCH_MORE_IMPORTANT]: 'Muito mais importante',
    [ImportanceScale.MORE_IMPORTANT]: 'Mais importante',
    [ImportanceScale.EQUALLY_IMPORTANT]: 'É tão importante quanto',
    [ImportanceScale.LESS_IMPORTANT]: 'Menos importante',
    [ImportanceScale.MUCH_LESS_IMPORTANT]: 'Muito menos importante',
    [ImportanceScale.EXTREMELY_LESS_IMPORTANT]: 'Extremamente menos importante',
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
    private criteriaGroupComparationsService: GrupoCriterioService,
    private breadcrumbService: BreadcrumbService
  ) {}

  async ngOnInit(): Promise<void> {
    // LIMPAR DADOS ANTERIORES PRIMEIRO
    this.clearComponentData();

    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(async params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
      const grupoIdParam = params.get('grupoId');
      this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;
      const criteriaId = params.get('criterioId');
      this.criteriaId = criteriaId ? Number(criteriaId) : 0;

      // COMPONENTE NETO: Simplesmente carrega dados e adiciona seu breadcrumb
      console.log('📍 Componente neto: Critério inicializando/recarregando');

      console.log('🔄 === INICIALIZANDO/RECARREGANDO COMPONENTE ===');
      console.log('  - Estratégia ID:', this.estrategiaId);
      console.log('  - Grupo ID:', this.criteriaGroupId);
      console.log('  - Critério ID:', this.criteriaId);

      // Carregar dados em sequência
      await this.loadCriteria();
      await this.loadAllGroupCriteria();
      await this.loadExistingComparisons();
    });
  }

  ngOnDestroy(): void {
    console.log('🧹 === DESTRUINDO COMPONENTE ===');

    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }

    this.clearComponentData();
  }

  // MÉTODO PARA LIMPAR TODOS OS DADOS DO COMPONENTE
  clearComponentData(): void {
    console.log('🧹 Limpando dados do componente...');

    // Limpar dados principais
    this.criteria = undefined;
    this.criteriaGroups = [];
    this.filteredCriteriaGroups = [];
    this.existingComparisons = [];
    this.comparisonValues = {};

    // Resetar flags
    this.loadingCriterios = false;
    this.showEditModal = false;
    this.showDeleteModal = false;

    // Limpar filtros
    this.searchTerm = '';
    this.activeTab = "diretas";

    console.log('✅ Dados limpos');
  }

  async loadCriteria(): Promise<void> {
    this.loadingCriterios = true;
    try {
      const criterio = await firstValueFrom(this.criterioService.getCriterioById(this.criteriaGroupId, this.criteriaId, this.estrategiaId));
      this.criteria = criterio;
      console.log('Critério carregado:', criterio);

      // COMPONENTE NETO: Adiciona seu breadcrumb ao array do pai
      this.breadcrumbService.addChildBreadcrumb({
        label: criterio.name || `Critério ${this.criteriaId}`,
        url: `/estrategia/${this.estrategiaId}/grupo-criterio/${this.criteriaGroupId}/criterio/${this.criteriaId}`,
        isActive: true
      });
    } catch (err) {
      console.error('Erro ao buscar critério:', err);
    } finally {
      this.loadingCriterios = false;
    }
  }

  async loadAllGroupCriteria(): Promise<void> {
    try {
      const criteriaGroup = await firstValueFrom(
        this.criterioService.getAllCriterios(this.estrategiaId, this.criteriaGroupId)
      );
      this.filteredCriteriaGroups = criteriaGroup;
      this.criteriaGroups = criteriaGroup;
      console.log('Todos os critérios carregados:', criteriaGroup);
    } catch (err) {
      console.error('Erro ao buscar grupo de critérios:', err);
    }
  }

  async loadExistingComparisons(): Promise<void> {
    try {
      const comparisons = await firstValueFrom(
        this.criteriaGroupComparationsService.getCriteriaComparisons(this.criteriaGroupId, this.estrategiaId)
      );
      this.existingComparisons = comparisons || [];

      console.log('📊 Comparações carregadas do servidor:', this.existingComparisons);

      // FILTRAR comparações apenas dos critérios que existem atualmente
      this.filterValidComparisons();

      this.initializeComparisonValues();
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
      this.existingComparisons = [];
      this.initializeComparisonValues();
    }
  }

  // FILTRAR comparações válidas baseadas nos critérios atuais
  filterValidComparisons(): void {
    if (!this.filteredCriteriaGroups || this.filteredCriteriaGroups.length === 0) {
      console.log('⚠️ Nenhum critério carregado, limpando todas as comparações');
      this.existingComparisons = [];
      return;
    }

    const currentCriteriaIds = this.filteredCriteriaGroups.map(c => c.id);
    console.log('📋 IDs dos critérios atuais:', currentCriteriaIds);

    const originalLength = this.existingComparisons.length;

    // Filtrar apenas comparações entre critérios que ainda existem
    this.existingComparisons = this.existingComparisons.filter(comparison => {
      // Verificar se os IDs existem e são válidos
      if (!comparison.comparedCriterionId || !comparison.referenceCriterionId) {
        console.log(`🗑️ Removendo comparação com IDs inválidos:`, comparison);
        return false;
      }

      const isValid = currentCriteriaIds.includes(comparison.comparedCriterionId) &&
                     currentCriteriaIds.includes(comparison.referenceCriterionId);

      if (!isValid) {
        console.log(`🗑️ Removendo comparação inválida: ${comparison.comparedCriterionId}→${comparison.referenceCriterionId} (critérios não existem mais)`);
      }

      return isValid;
    });

    const filteredLength = this.existingComparisons.length;
    console.log(`✅ Filtradas: ${originalLength} → ${filteredLength} comparações válidas`);
  }

  // MÉTODO CRÍTICO: Verificar se já existe QUALQUER comparação entre dois critérios
  hasAnyComparisonBetween(criteriaId: number, otherCriteriaId: number): boolean {
    const hasComparison = this.existingComparisons.some(c =>
      (c.comparedCriterionId === criteriaId && c.referenceCriterionId === otherCriteriaId) ||
      (c.comparedCriterionId === otherCriteriaId && c.referenceCriterionId === criteriaId)
    );

    console.log(`🔍 Verificando se existe comparação entre ${criteriaId} e ${otherCriteriaId}: ${hasComparison}`);
    return hasComparison;
  }

  // Método para buscar comparação bidirecional - PREVENÇÃO TOTAL DE DUPLICATAS
  getBidirectionalComparison(criteriaId: number, otherCriteriaId: number): {
    comparison: CriteriaComparison | undefined,
    isInverted: boolean
  } {
    // VERIFICAÇÃO RIGOROSA: Buscar QUALQUER comparação entre estes dois critérios
    const directComparison = this.existingComparisons.find(c =>
      c.comparedCriterionId === criteriaId && c.referenceCriterionId === otherCriteriaId
    );

    if (directComparison) {
      console.log(`✅ Comparação direta encontrada: ${criteriaId} → ${otherCriteriaId}`, directComparison);
      return { comparison: directComparison, isInverted: false };
    }

    // Buscar comparação inversa
    const inverseComparison = this.existingComparisons.find(c =>
      c.comparedCriterionId === otherCriteriaId && c.referenceCriterionId === criteriaId
    );

    if (inverseComparison) {
      console.log(`🔄 Comparação inversa encontrada: ${otherCriteriaId} → ${criteriaId}`, inverseComparison);
      return { comparison: inverseComparison, isInverted: true };
    }

    console.log(`❌ Nenhuma comparação entre ${criteriaId} e ${otherCriteriaId}`);
    return { comparison: undefined, isInverted: false };
  }

  // Método para buscar comparação (usando lógica bidirecional)
  getExistingComparison(comparedCriterionId: number, referenceCriterionId: number): CriteriaComparison | undefined {
    const { comparison } = this.getBidirectionalComparison(comparedCriterionId, referenceCriterionId);
    return comparison;
  }

  // Método para inicializar valores de comparação - VERSÃO ROBUSTA
  initializeComparisonValues(): void {
    if (!this.criteria || !this.filteredCriteriaGroups) {
      console.log('⚠️ Inicialização cancelada: dados não disponíveis');
      return;
    }

    console.log(`\n🔧 === INICIALIZANDO VALORES DE COMPARAÇÃO ===`);
    console.log(`Critério atual: ${this.criteria.name} (ID: ${this.criteria.id})`);
    console.log(`Comparações existentes válidas: ${this.existingComparisons.length}`);

    // SEMPRE limpar e recriar o objeto de comparações para este critério
    this.comparisonValues[this.criteria.id] = {};

    const otherCriteria = this.getOtherCriteria();
    console.log(`Outros critérios para comparar: ${otherCriteria.length}`);

    otherCriteria.forEach(otherCriterion => {
      console.log(`\n🔍 Verificando par: ${this.criteria!.id} vs ${otherCriterion.id}`);

      const { comparison, isInverted } = this.getBidirectionalComparison(this.criteria!.id, otherCriterion.id);

      if (comparison) {
        if (isInverted) {
          // Comparação inversa: mostrar valor invertido
          const mappedScale = this.importanceScaleInverseMap[comparison.importanceScale];
          this.comparisonValues[this.criteria!.id][otherCriterion.id] = mappedScale;
          console.log(`🔄 Comparação inversa: ${comparison.importanceScale} → ${mappedScale}`);
        } else {
          // Comparação direta: mostrar valor original
          this.comparisonValues[this.criteria!.id][otherCriterion.id] = comparison.importanceScale;
          console.log(`➡️ Comparação direta: ${comparison.importanceScale}`);
        }
      } else {
        // Sem comparação: campo vazio
        this.comparisonValues[this.criteria!.id][otherCriterion.id] = '';
        console.log(`❌ Sem comparação`);
      }
    });

    console.log(`✅ Valores inicializados para critério ${this.criteria.id}:`, this.comparisonValues[this.criteria.id]);
    console.log(`📊 Estado completo de comparisonValues:`, this.comparisonValues);
    console.log(`🔧 === FIM DA INICIALIZAÇÃO ===\n`);

    // FORÇAR DETECÇÃO DE MUDANÇAS (para Angular 10)
    setTimeout(() => {
      console.log('🔄 Forçando atualização do template...');
    }, 100);
  }

  // Método para lidar com mudanças no select de forma mais robusta
  onSelectChange(criteria: Criterion, otherCriteria: Criterion, selectedValue: any): void {
    console.log(`🔄 Select mudou: ${criteria.id} vs ${otherCriteria.id} = ${selectedValue}`);

    // Atualizar o valor no objeto
    if (!this.comparisonValues[criteria.id]) {
      this.comparisonValues[criteria.id] = {};
    }
    this.comparisonValues[criteria.id][otherCriteria.id] = selectedValue;

    // Chamar o método de mudança de importância
    this.onImportanceChange(criteria, otherCriteria);
  }
  async onImportanceChange(criteria: Criterion, otherCriteria: Criterion): Promise<void> {
    if (!criteria?.id || !otherCriteria?.id) {
      console.error('❌ IDs inválidos:', criteria?.id, otherCriteria?.id);
      return;
    }

    const selectedValue = this.comparisonValues[criteria.id][otherCriteria.id];

    if (selectedValue === '' || selectedValue === undefined) {
      console.log('⚠️ Valor selecionado é vazio');
      return;
    }

    console.log(`\n🔄 === MUDANÇA DE IMPORTÂNCIA ===`);
    console.log(`Critério A: ${criteria.name} (ID: ${criteria.id})`);
    console.log(`Critério B: ${otherCriteria.name} (ID: ${otherCriteria.id})`);
    console.log(`Valor selecionado: ${selectedValue}`);
    console.log(`Total de comparações existentes: ${this.existingComparisons.length}`);

    try {
      // STEP 1: Verificar se JÁ EXISTE qualquer comparação entre estes critérios
      const existsComparison = this.hasAnyComparisonBetween(criteria.id, otherCriteria.id);

      if (existsComparison) {
        // ✅ JÁ EXISTE - FAZER UPDATE
        console.log('🔄 Já existe comparação, fazendo UPDATE...');

        const { comparison, isInverted } = this.getBidirectionalComparison(criteria.id, otherCriteria.id);

        if (!comparison || !comparison.id) {
          console.error('❌ ERRO: Comparação existe mas não foi encontrada!');
          return;
        }

        let scaleToSave: ImportanceScale;

        if (isInverted) {
          // Comparação inversa: inverter o valor
          scaleToSave = this.importanceScaleInverseMap[selectedValue as ImportanceScale];
          console.log(`🔄 Inversão: ${selectedValue} → ${scaleToSave}`);
        } else {
          // Comparação direta: usar valor como está
          scaleToSave = selectedValue as ImportanceScale;
          console.log(`➡️ Direto: ${scaleToSave}`);
        }

        const requestBodyUpdate = {
          id: comparison.id,
          comparedCriterionId: comparison.comparedCriterionId,
          referenceCriterionId: comparison.referenceCriterionId,
          importanceScale: scaleToSave,
          criteriaGroupId: this.criteriaGroupId
        };

        console.log('📤 Enviando UPDATE:', requestBodyUpdate);

        const updatedComparison = await firstValueFrom(
          this.criteriaGroupComparationsService.updateCriteriaComparison(
            requestBodyUpdate,
            comparison.id,
            this.criteriaGroupId,
            this.estrategiaId
          )
        );

        // Atualizar localmente
        const index = this.existingComparisons.findIndex(c => c.id === comparison.id);
        if (index !== -1) {
          if (updatedComparison && updatedComparison.id) {
            this.existingComparisons[index] = updatedComparison;
            console.log('✅ UPDATE bem-sucedido no servidor');
          } else {
            this.existingComparisons[index] = {
              ...this.existingComparisons[index],
              importanceScale: scaleToSave
            };
            console.log('⚠️ UPDATE retornou null, atualizando localmente');
          }
        }

      } else {
        // ✅ NÃO EXISTE - FAZER CREATE
        console.log('➕ Não existe comparação, fazendo CREATE...');

        const requestBodyCreate = {
          comparedCriterionId: criteria.id,
          referenceCriterionId: otherCriteria.id,
          importanceScale: selectedValue as ImportanceScale,
          criteriaGroupId: this.criteriaGroupId
        };

        console.log('📤 Enviando CREATE:', requestBodyCreate);

        const newComparison = await firstValueFrom(
          this.criteriaGroupComparationsService.createCriteriaComparison(
            requestBodyCreate,
            this.criteriaGroupId,
            this.estrategiaId
          )
        );

        if (newComparison && newComparison.id) {
          this.existingComparisons.push(newComparison);
          console.log('✅ CREATE bem-sucedido:', newComparison);
        } else {
          console.log('⚠️ CREATE retornou null, recarregando dados...');
          await this.loadExistingComparisons();
        }
      }

      console.log(`🏁 === FIM DA MUDANÇA ===\n`);

    } catch (error) {
      console.error('❌ ERRO ao salvar:', error);
      // Reverter valor em caso de erro
      this.comparisonValues[criteria.id][otherCriteria.id] = '';
      alert('Erro ao salvar comparação. Tente novamente.');
    }
  }

  // Verificar se critério pode ser excluído
  canDeleteCriteria(): boolean {
    if (!this.criteria) return false;

    // Verificar se o critério tem comparações (como comparador ou como referência)
    const hasComparisons = this.existingComparisons.some(comparison =>
      comparison.comparedCriterionId === this.criteria!.id ||
      comparison.referenceCriterionId === this.criteria!.id
    );

    return !hasComparisons;
  }

  // Obter mensagem de erro de exclusão
  getDeleteErrorMessage(): string {
    if (!this.criteria) return '';

    const comparisonsAsComparator = this.existingComparisons.filter(c => c.comparedCriterionId === this.criteria!.id).length;
    const comparisonsAsReference = this.existingComparisons.filter(c => c.referenceCriterionId === this.criteria!.id).length;
    const totalComparisons = comparisonsAsComparator + comparisonsAsReference;

    return `Este critério não pode ser excluído pois possui ${totalComparisons} avaliação(ões) associada(s). Remova todas as avaliações antes de excluir o critério.`;
  }

  // Método para obter comparações recíprocas (com lógica bidirecional)
  getReciprocalComparisons(): {criteria: Criterion, comparisonText: string, hasComparison: boolean}[] {
    if (!this.criteria || !this.filteredCriteriaGroups) return [];

    return this.getOtherCriteria().map(otherCriteria => {
      // Procurar comparação onde otherCriteria é o comparador e criteria atual é a referência
      const { comparison, isInverted } = this.getBidirectionalComparison(otherCriteria.id, this.criteria!.id);

      let comparisonText = 'Não avaliado';
      let hasComparison = false;

      if (comparison) {
        hasComparison = true;

        if (!isInverted) {
          // Comparação direta: otherCriteria comparou com criteria atual
          comparisonText = this.importanceScaleMap[comparison.importanceScale];
        } else {
          // Comparação inversa: criteria atual comparou com otherCriteria
          // Mostrar o inverso (como seria na perspectiva do otherCriteria)
          const invertedScale = this.importanceScaleInverseMap[comparison.importanceScale];
          comparisonText = this.importanceScaleMap[invertedScale];
        }
      }

      return {
        criteria: otherCriteria,
        comparisonText,
        hasComparison
      };
    });
  }

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

  getImportanceScaleEntries() {
    return Object.keys(this.importanceScaleMap).map(key => ({
      key: key,
      value: this.importanceScaleMap[key as ImportanceScale]
    }));
  }

  goBack(): void {
    // Remover o breadcrumb do critério antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.estrategiaId}/grupo-criterio/${this.criteriaGroupId}/criterio/${this.criteriaId}`);
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
    // Verificar se pode deletar antes de tentar
    if (!this.canDeleteCriteria()) {
      // Mostrar mensagem de erro do navegador
      alert(this.getDeleteErrorMessage());
      return;
    }
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

    // Reinicializar valores de comparação após filtro
    if (this.criteria) {
      this.initializeComparisonValues();
    }
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

  // Métodos TrackBy para otimização do Angular
  trackByCriteriaId(index: number, item: Criterion): number {
    return item.id;
  }

  trackByReciprocalId(index: number, item: {criteria: Criterion, comparisonText: string, hasComparison: boolean}): number {
    return item.criteria.id;
  }

  // Método para verificar se os dados estão prontos para renderizar
  isDataReady(): boolean {
    return !this.loadingCriterios &&
           !!this.criteria &&
           !!this.criteria.id &&
           !!this.comparisonValues[this.criteria.id] &&
           this.filteredCriteriaGroups.length > 0;
  }

  // Método auxiliar para garantir que criteria existe (Type Guard)
  hasCriteria(): this is { criteria: Criterion } {
    return !!this.criteria && !!this.criteria.id;
  }

  // MÉTODO DE DEBUG ESPECÍFICO PARA IDENTIFICAR PROBLEMAS
  debugCriteriaComparisons(): void {
    console.log('\n🐛 === DEBUG DETALHADO ===');
    console.log('📊 Estado atual:');
    console.log('  - Critério atual:', this.criteria?.id, this.criteria?.name);
    console.log('  - Grupo ID:', this.criteriaGroupId);
    console.log('  - Estratégia ID:', this.estrategiaId);
    console.log('  - Total de comparações carregadas:', this.existingComparisons.length);

    console.log('\n📋 Todas as comparações:');
    this.existingComparisons.forEach((comp, index) => {
      console.log(`  ${index + 1}. ID:${comp.id} | ${comp.comparedCriterionId}→${comp.referenceCriterionId} | ${comp.importanceScale}`);
    });

    console.log('\n🔍 Verificação por critério:');
    this.getOtherCriteria().forEach(other => {
      const hasAny = this.hasAnyComparisonBetween(this.criteria!.id, other.id);
      const { comparison, isInverted } = this.getBidirectionalComparison(this.criteria!.id, other.id);
      console.log(`  ${this.criteria!.id} vs ${other.id}: exists=${hasAny}, found=${!!comparison}, inverted=${isInverted}`);
    });

    console.log('🐛 === FIM DEBUG ===\n');
  }
}
