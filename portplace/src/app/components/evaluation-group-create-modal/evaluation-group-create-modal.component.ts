import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriteriaGroup, EvaluationGroup } from '../../interface/interfacies';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Page } from '../../models/pagination-models';

@Component({
  selector: 'app-evaluation-group-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-group-create-modal.component.html',
  styleUrl: './evaluation-group-create-modal.component.scss'
})
export class EvaluationGroupCreateModal {
  @Input() isVisible = false;

  @Output() close = new EventEmitter<void>();

  httpClient = inject(HttpClient);
  criteriaGroupService = inject(CriteriaGroupService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  strategyId = -1;

  showValidationError = false;

  inputName = '';
  inputDescription = '';
  inputCriteriaGroupSelectedId = '';

  inputCriteriaGroupsOptions: CriteriaGroup[] = [];

  errorMessage = '';

  isSubmitButtonDisabled = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    this.restartForm();
  }

  restartForm() {
    this.clearForm();
    this.setInputCriteriaGroupOptions();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  async onSave(): Promise<any> {
    let isFormValid = await this.isFormValid();

    if (!isFormValid)
      return;

    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;
    let body = {
      name: this.inputName,
      description: this.inputDescription,
      criteriaGroupId: Number(this.inputCriteriaGroupSelectedId),
      strategyId: this.strategyId
    }
    console.log(body);
    let postEvaluationGroup$ = this.httpClient.post(evaluationGroupsRoute, body);

    postEvaluationGroup$.subscribe({
      error: () => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      complete: () => this.goToEvaluationGroupDetailPage()
    });
  }

  goToEvaluationGroupDetailPage() {
    this.getNewlyCreatedEvaluationGroupByHttpRequest().subscribe(evaluationGroup => {
      if (evaluationGroup)
        this.router.navigate([`/estrategia/${this.strategyId}/grupo-avaliacao/${evaluationGroup.id}`]);
      else
        this.onClose();
    });
  }

  getNewlyCreatedEvaluationGroupByHttpRequest(): Observable<EvaluationGroup | undefined> {
    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;

    return this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } })
      .pipe(
        map(page => page.content),
        map(evaluationGroups => evaluationGroups.find(evaluationGroup => evaluationGroup.name == this.inputName))
    );
  }

  clearForm() {
    this.inputName = '';
    this.inputDescription = '';
    this.inputCriteriaGroupSelectedId = '';
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
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
    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;
    let getAllEvaluationGroups$ = this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
    let evaluationGroups = await firstValueFrom(getAllEvaluationGroups$);
    let isUnique = !evaluationGroups.some(evaluationGroup => evaluationGroup.name == this.inputName);

    this.errorMessage = isUnique ? '' : 'Nome já cadastrado.';

    return isUnique;
  }

  doesSelectedCriteriaGroupHaveAtLeastOneCriteria(selectedCriteriaGroup: any): boolean {
    let criteriaCount = selectedCriteriaGroup?.criteria?.length ?? 0;
    let hasAtLeastOneCriteria = criteriaCount > 0;

    this.errorMessage = hasAtLeastOneCriteria ? '' : 'O grupo de critérios selecionado não possui critérios. Acesse sua página e realize o cadastro.';

    return hasAtLeastOneCriteria;
  }

  doesSelectedCriteriaGroupHaveAllCriteriaComparisons(selectedCriteriaGroup: any): boolean {
    let criteriaCount = selectedCriteriaGroup?.criteria?.length ?? 0;
    let totalCriteriaComparisons = selectedCriteriaGroup?.criteriaComparisons?.length ?? 0;
    let totalCriteriaComparisonsExpected = this.getTotalCriteriaComparisonsExpectedByCriteriaQuantity(criteriaCount);

      if (totalCriteriaComparisons != totalCriteriaComparisonsExpected) {
        this.errorMessage = 'Os critérios do grupo de critérios selecionado não foram totalmente comparados entre si. Acesse sua página e finalize a comparação. Ou, selecione outro grupo de critério.';
        return false;
      }

      return true;
    }

  async isCriteriaGroupSelectedValid(): Promise<boolean> {
    let isValid = this.isCriteriaGroupSelected();

    let selectedCriteriaGroup = await firstValueFrom(this.criteriaGroupService.getCriterioById(Number(this.inputCriteriaGroupSelectedId), this.strategyId));

    if (!selectedCriteriaGroup) {
        this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        return false;
    }

    return isValid
      && this.doesSelectedCriteriaGroupHaveAtLeastOneCriteria(selectedCriteriaGroup)
      && this.doesSelectedCriteriaGroupHaveAllCriteriaComparisons(selectedCriteriaGroup);
  }

  isCriteriaGroupSelected(): boolean {
    let isCriteriaGroupSelected = !!this.inputCriteriaGroupSelectedId.trim();

    this.errorMessage = isCriteriaGroupSelected ? '' : 'Os campos marcados com * são obrigatórios.';

    return isCriteriaGroupSelected;
  }

  getSelectedCriteriaGroupObject(): CriteriaGroup | undefined {
    const selected = this.inputCriteriaGroupsOptions.find(criteriaGroup => criteriaGroup.id == Number(this.inputCriteriaGroupSelectedId));
    console.log('getSelectedCriteriaGroupObject:', {
      inputCriteriaGroupsOptions: this.inputCriteriaGroupsOptions,
      inputCriteriaGroupSelectedId: this.inputCriteriaGroupSelectedId,
      selected
    });
    return selected;
  }

  setInputCriteriaGroupOptions() {
    this.criteriaGroupService.getAllCriterios(this.strategyId).subscribe(criteriaGroups => {
      this.inputCriteriaGroupsOptions = criteriaGroups;
      console.log('this.inputCriteriaGroupsOptions', this.inputCriteriaGroupsOptions);
      if (!criteriaGroups.length) {
        this.errorMessage = 'Nenhum grupo de critérios foi cadastrado. Realize seu cadastro na página de critérios.';
        this.isSubmitButtonDisabled = true;
      }
    });
  }

  getTotalCriteriaComparisonsExpectedByCriteriaQuantity(criteriaQuantity: number): number {
    let n = criteriaQuantity;

    return n * (n - 1) / 2
  }
}
