import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriteriaGroup, EvaluationGroup } from '../../interface/interfacies';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Page } from '../../models/pagination-models';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-evaluation-group-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-group-create-modal.component.html',
  styleUrl: './evaluation-group-create-modal.component.scss'
})
export class EvaluationGroupCreateModal {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

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
    this.saved.emit();
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

  doesSelectedCriteriaGroupHaveAtLeastOneCriteria(): boolean {
    let selectedCriteriaGroup = this.getSelectedCriteriaGroupObject();
    let hasAtLeastOneCriteria = true;

    console.log('criteriaCount:', selectedCriteriaGroup);
    // if (selectedCriteriaGroup) {
    //   hasAtLeastOneCriteria = (selectedCriteriaGroup.relatedObjectivesCount ?? 0) > 0;
    //   console.log('criteriaCount:', selectedCriteriaGroup.relatedObjectivesCount);
    // }

    this.errorMessage = hasAtLeastOneCriteria ? '' : 'O grupo de critérios selecionado não possui critérios. Acesse sua página e realize o cadastro.';

    return hasAtLeastOneCriteria;
  }

  doesSelectedCriteriaGroupHaveAllCriteriaComparisons(): boolean {
      let selectedCriteriaGroup = this.getSelectedCriteriaGroupObject();
      console.log('selectedCriteriaGroup:', selectedCriteriaGroup);

      if (!selectedCriteriaGroup) {
        this.errorMessage = 'Selecione um grupo de critérios válido.';
        return false;
      }

      let totalCriteriaComparisons = selectedCriteriaGroup.relatedEvaluationGroupsCount ?? 0;
      let totalCriteriaComparisonsExpected = this.getTotalCriteriaComparisonsExpectedByCriteriaQuantity(selectedCriteriaGroup.relatedObjectivesCount ?? 0);
      console.log('totalCriteriaComparisons:', totalCriteriaComparisons);
      console.log('totalCriteriaComparisonsExpected:', totalCriteriaComparisonsExpected);
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
