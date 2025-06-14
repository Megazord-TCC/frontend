import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriteriaGroup, FormField } from '../../interface/interfacies';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-evaluation-group-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-group-create-modal.component.html',
  styleUrl: './evaluation-group-create-modal.component.scss'
})
export class EvaluationGroupCreateModal {
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<FormField[]>();

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);

  strategyId = -1;

  showValidationError = false;

  inputName = '';
  inputDescription = '';
  inputCriteriaGroupSelectedId = '';

  inputCriteriaGroupsOptions: CriteriaGroup[] = [];

  errorMessage = '';

  isSubmitButtonDisabled = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('id'));
    this.setInputCriteriaGroupOptions();
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

  onSave(): void {
    if (!this.isFormValid())
      return;

    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps`;
    let body = {
      name: this.inputName,
      description: this.inputDescription,
      criteriaGroupId: Number(this.inputCriteriaGroupSelectedId),
      strategyId: this.strategyId
    }

    let postEvaluationGroup$ = this.httpClient.post(evaluationGroupsRoute, body);

    postEvaluationGroup$.subscribe(_ => this.onClose());
  }

  clearForm() {
    this.inputName = '';
    this.inputDescription = '';
    this.inputCriteriaGroupSelectedId = '';
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
  }

  isFormValid(): boolean {
    return this.isNameValid() && this.isCriteriaGroupSelectedValid();
  }

  isNameValid(): boolean {
    let isNameFilled = !!this.inputName.trim();

    this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';
    
    return isNameFilled;
  }

  isCriteriaGroupSelectedValid(): boolean {
    let isCriteriaGroupSelected = !!this.inputCriteriaGroupSelectedId.trim();

    this.errorMessage = isCriteriaGroupSelected ? '' : 'Os campos marcados com * são obrigatórios.';
    
    return isCriteriaGroupSelected;
  }

  setInputCriteriaGroupOptions() {
    let criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;
    let getAllCriteriaGroups$ = this.httpClient.get<CriteriaGroup[]>(criteriaGroupsRoute);

    // TODO: Adicionar regra para "O grupo de critérios selecionado não possui critérios. Acesse sua página e realize o cadastro.".
    // TODO: Adicionar regra para "Os critérios do grupo de critérios selecionado não foram totalmente comparados entre si. Acesse sua página e finalize a comparação.".
    getAllCriteriaGroups$.subscribe(criteriaGroups => {
      this.inputCriteriaGroupsOptions = criteriaGroups;
      
      if (!criteriaGroups.length) {
        this.errorMessage = 'Nenhum grupo de critérios foi cadastrado. Realize seu cadastro na página de critérios.';
        this.isSubmitButtonDisabled = true;
      }
    });
  }
}
