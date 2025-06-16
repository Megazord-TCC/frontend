import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriteriaGroup, EvaluationGroup, EvaluationGroupView } from '../../interface/carlos-interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-evaluation-group-edit-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-group-edit-modal.component.html',
  styleUrl: './evaluation-group-edit-modal.component.scss'
})
export class EvaluationGroupEditModal {
  @Input() isVisible = false;
  @Input() evaluationGroup: EvaluationGroupView | undefined;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);

  strategyId = -1;

  inputName = '';
  inputDescription = '';
  inputCriteriaGroupSelectedId = '';

  inputCriteriaGroupsOptions: CriteriaGroup[] = [];

  errorMessage = '';
  isSubmitButtonDisabled = false;
  isDeleteButtonDisabled = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
  }

  ngOnChanges() {
    if (this.isVisible && this.evaluationGroup) {
      this.loadFormData();
      this.setInputCriteriaGroupOptions();
    }
  }

  loadFormData() {
    if (this.evaluationGroup) {
      this.inputName = this.evaluationGroup.name || '';
      this.inputDescription = this.evaluationGroup.description || '';
      this.inputCriteriaGroupSelectedId = this.evaluationGroup.criteriaGroupId?.toString() || '';
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.clearForm();
    this.close.emit();
  }

  async onSave(): Promise<any> {
    let isFormValid = await this.isFormValid();

    if (!isFormValid)
      return;

    let evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroup?.id}`;
    let body = {
      name: this.inputName,
      description: this.inputDescription,
      criteriaGroupId: Number(this.inputCriteriaGroupSelectedId),
      strategyId: this.strategyId
    }

    let putEvaluationGroup$ = this.httpClient.put(evaluationGroupRoute, body);

    putEvaluationGroup$.subscribe({
      error: () => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      complete: () => {
        this.updated.emit();
        this.onClose();
      }
    });
  }

  async onDelete(): Promise<any> {
    if (!confirm('Tem certeza que deseja excluir este grupo de avaliações? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.isDeleteButtonDisabled = true;

    let evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroup?.id}`;
    let deleteEvaluationGroup$ = this.httpClient.delete(evaluationGroupRoute);

    deleteEvaluationGroup$.subscribe({
      next: () => {
        this.deleted.emit();
        this.onClose();
      },
      error: () => {
        this.errorMessage = 'Ocorreu um erro ao excluir. Tente novamente mais tarde.';
        this.isDeleteButtonDisabled = false;
      }
    });
  }

  clearForm() {
    this.inputName = '';
    this.inputDescription = '';
    this.inputCriteriaGroupSelectedId = '';
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
    this.isDeleteButtonDisabled = false;
  }

  async isFormValid(): Promise<boolean> {
    return this.isNameFilled()
      && await this.isNameUnique()
      && this.isCriteriaGroupSelectedValid();
  }

  isNameFilled(): boolean {
    let isNameFilled = !!this.inputName.trim();

    this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';

    return isNameFilled;
  }

  async isNameUnique(): Promise<boolean> {
    // Se o nome não foi alterado, não precisa validar unicidade
    if (this.inputName === this.evaluationGroup?.name) {
      return true;
    }

    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps`;
    let getAllEvaluationGroups$ = this.httpClient.get<EvaluationGroup[]>(evaluationGroupsRoute);
    let evaluationGroups = await firstValueFrom(getAllEvaluationGroups$);
    let isUnique = !evaluationGroups.some(evaluationGroup =>
      evaluationGroup.name === this.inputName && evaluationGroup.id !== this.evaluationGroup?.id
    );

    this.errorMessage = isUnique ? '' : 'Nome já cadastrado.';

    return isUnique;
  }

  doesSelectedCriteriaGroupHaveAtLeastOneCriteria(): boolean {
    let selectedCriteriaGroup = this.getSelectedCriteriaGroupObject();
    let hasAtLeastOneCriteria = false;

    if (selectedCriteriaGroup)
      hasAtLeastOneCriteria = selectedCriteriaGroup.criteriaCount > 0;

    this.errorMessage = hasAtLeastOneCriteria ? '' : 'O grupo de critérios selecionado não possui critérios. Acesse sua página e realize o cadastro.';

    return hasAtLeastOneCriteria;
  }

  doesSelectedCriteriaGroupHaveAllCriteriaComparisons(): boolean {
    let selectedCriteriaGroup = this.getSelectedCriteriaGroupObject();
    let totalCriteriaComparisons = selectedCriteriaGroup?.criteriaComparisonCount ?? 0;
    let totalCriteriaComparisonsExpected = this.getTotalCriteriaComparisonsExpectedByCriteriaQuantity(selectedCriteriaGroup?.criteriaCount ?? 0);

    if (totalCriteriaComparisons != totalCriteriaComparisonsExpected) {
      this.errorMessage = 'Os critérios do grupo de critérios selecionado não foram totalmente comparados entre si. Acesse sua página e finalize a comparação. Ou, selecione outro grupo de critério.';
      return false;
    }

    return true;
  }

  isCriteriaGroupSelectedValid(): boolean {
    return this.isCriteriaGroupSelected()
      && this.doesSelectedCriteriaGroupHaveAtLeastOneCriteria()
      && this.doesSelectedCriteriaGroupHaveAllCriteriaComparisons();
  }

  isCriteriaGroupSelected(): boolean {
    let isCriteriaGroupSelected = !!this.inputCriteriaGroupSelectedId.trim();

    this.errorMessage = isCriteriaGroupSelected ? '' : 'Os campos marcados com * são obrigatórios.';

    return isCriteriaGroupSelected;
  }

  getSelectedCriteriaGroupObject(): CriteriaGroup | undefined {
    return this.inputCriteriaGroupsOptions.find(criteriaGroup => criteriaGroup.id == Number(this.inputCriteriaGroupSelectedId));
  }

  setInputCriteriaGroupOptions() {
    let criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;
    let getAllCriteriaGroups$ = this.httpClient.get<CriteriaGroup[]>(criteriaGroupsRoute);

    getAllCriteriaGroups$.subscribe(criteriaGroups => {
      this.inputCriteriaGroupsOptions = criteriaGroups;

      if (!criteriaGroups.length) {
        this.errorMessage = 'Nenhum grupo de critérios foi cadastrado. Realize seu cadastro na página de critérios.';
        this.isSubmitButtonDisabled = true;
      }
    });
  }

  getTotalCriteriaComparisonsExpectedByCriteriaQuantity(criteriaQuantity: number): number {
    let n = criteriaQuantity;
    return n * (n - 1) / 2;
  }
}
