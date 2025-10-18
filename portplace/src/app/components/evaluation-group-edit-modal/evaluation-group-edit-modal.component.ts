import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CriteriaGroup, EvaluationGroup } from '../../interface/carlos-interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom, map } from 'rxjs';
import { Page } from '../../models/pagination-models';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { EvaluationGroupApiResponse } from '../../interface/interfacies';

@Component({
  selector: 'app-evaluation-group-edit-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-group-edit-modal.component.html',
  styleUrl: './evaluation-group-edit-modal.component.scss'
})
export class EvaluationGroupEditModal {
  @Input() isVisible = false;
  @Input({ required: true }) evaluationGroup?: EvaluationGroupApiResponse;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  criteriaGroupService = inject(CriteriaGroupService);
  strategyId = -1;

  inputName = '';
  inputDescription = '';
  inputCriteriaGroupSelectedId = '';

  inputCriteriaGroupsOptions: EvaluationGroupApiResponse[] = [];

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
      this.inputCriteriaGroupSelectedId = this.evaluationGroup.criteriaGroup.id.toString() || '';
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
    if (!isFormValid) return;

    // Monta DTO para atualização do EvaluationGroup


    // Coletar os IDs dos projetos presentes no grupo (usando evaluation.project.id)
    const projectIds = (this.evaluationGroup?.evaluations || [])
      .map(ev => ev.project?.id)
      .filter((id): id is number => typeof id === 'number');

    const dto = {
      name: this.inputName,
      description: this.inputDescription,
      strategyId: this.strategyId,
      status: this.evaluationGroup?.status ,
      projectIds
      // status pode ser adicionado se necessário
    };

    this.criteriaGroupService.updateEvaluationGroup(
      this.evaluationGroup!.id,
      this.strategyId,
      dto
    ).subscribe({
      error: (err) => {this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'; console.error(err)},
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

    let evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups/${this.evaluationGroup?.id}`;
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

    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;
    let getAllEvaluationGroups$ = this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
    let evaluationGroups = await firstValueFrom(getAllEvaluationGroups$);
    let isUnique = !evaluationGroups.some(evaluationGroup =>
      evaluationGroup.name === this.inputName && evaluationGroup.id !== this.evaluationGroup?.id
    );

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
    let totalCriteriaComparisons = selectedCriteriaGroup?.criteriaComparisonCount ?? 0;
    let totalCriteriaComparisonsExpected = this.getTotalCriteriaComparisonsExpectedByCriteriaQuantity(selectedCriteriaGroup?.criteriaCount ?? 0);

    if (totalCriteriaComparisons != totalCriteriaComparisonsExpected) {
      this.errorMessage = 'Os critérios do grupo de critérios selecionado não foram totalmente comparados entre si. Acesse sua página e finalize a comparação. Ou, selecione outro grupo de critério.';
      return false;
    }

    return true;
  }

  async isCriteriaGroupSelectedValid(): Promise<boolean> {
    let isValid = this.isCriteriaGroupSelected();

    let selectedCriteriaGroup = await firstValueFrom(this.criteriaGroupService.getCriterioById(Number(this.inputCriteriaGroupSelectedId), this.strategyId));
    console.log(selectedCriteriaGroup);
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

  getSelectedCriteriaGroupObject(): EvaluationGroupApiResponse | undefined {
    return this.inputCriteriaGroupsOptions.find(criteriaGroup => criteriaGroup.id == Number(this.inputCriteriaGroupSelectedId));
  }

  setInputCriteriaGroupOptions() {
    let criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;
    let getAllCriteriaGroups$ = this.httpClient.get<Page<EvaluationGroupApiResponse>>(criteriaGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));

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
