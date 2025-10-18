import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EvaluationGroup, Portfolio } from '../../interface/carlos-interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ScenarioService } from '../../service/scenario-service';
import { handleScenarioBudgetKeyDown } from '../../helpers/money-helper';

@Component({
    selector: 'app-scenario-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './scenario-create-modal.component.html',
    styleUrl: './scenario-create-modal.component.scss'
})
export class ScenarioCreateModal {
    @Input() isVisible = false;

    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    strategyId = -1;

    showValidationError = false;

    inputName = '';
    inputDescription = '';
    inputPortfolioSelectedId = '';
    inputEvaluationGroupSelectedId = '';
    inputBudget = '';

    inputPortfolioOptions: Portfolio[] = [];
    inputEvaluationGroupOptions: EvaluationGroup[] = [];

    errorMessage = '';

    isSubmitButtonDisabled = false;

    mouseDownOnOverlay = false;

    ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.setInputPortfolioOptions();
        this.setInputEvaluationGroupOptions();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) {
            this.onClose();
        }
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.mouseDownOnOverlay = true;
        }
    }

    onClose(): void {
        this.close.emit();
    }

    async onSave(): Promise<any> {
        let isFormValid = await this.isFormValid();

        if (!isFormValid)
            return;

        const budgetNumber = this.parseBudgetToNumber(this.inputBudget);

        this.scenarioService
            .createScenario(
                this.inputName,
                this.inputDescription,
                this.inputPortfolioSelectedId,
                this.inputEvaluationGroupSelectedId,
                this.strategyId,
                budgetNumber
            )
            .subscribe({
                next: (createdScenarioId: number) => this.goToScenarioDetailPage(createdScenarioId),
                error: () => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
    }

    goToScenarioDetailPage(scenarioId: number) {
        this.router.navigate([`/estrategia/${this.strategyId}/cenario/${scenarioId}`]);
    }

    clearForm() {
        this.inputName = '';
        this.inputDescription = '';
        this.inputPortfolioSelectedId = '';
        this.inputEvaluationGroupSelectedId = '';
        this.inputBudget = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isNameFilled()
            && await this.isNameUnique()
            && this.isBudgetFilledAndValid()
            && this.isPortfolioSelectedValid()
            && this.isEvaluationGroupSelectedValid();
    }

    isBudgetFilledAndValid(): boolean {
        const value = this.inputBudget.trim();
        const numberValue = this.parseBudgetToNumber(value);
        const isValid = !!value && !isNaN(numberValue) && numberValue > 0;
        this.errorMessage = isValid ? '' : 'O campo Orçamento (R$) é obrigatório e deve ser um valor válido maior que zero.';
        return isValid;
    }

    isNameFilled(): boolean {
        let isNameFilled = !!this.inputName.trim();

        this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';

        return isNameFilled;
    }

    async isNameUnique(): Promise<boolean> {
        let scenarioNameAlreadyExists = await firstValueFrom(this.scenarioService.getScenarioByExactName(this.strategyId, this.inputName));

        this.errorMessage = scenarioNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !scenarioNameAlreadyExists;
    }

    doesSelectedEvaluationGroupHaveAtLeastOneProject(): boolean {
        let selectedCriteriaGroup = this.getSelectedEvaluationGroupObject();
        let hasAtLeastOneProject = false;

        if (selectedCriteriaGroup && selectedCriteriaGroup.evaluations?.length)
            hasAtLeastOneProject = true;

        this.errorMessage = hasAtLeastOneProject ? '' : 'Grupo de avaliação selecionado não possui projetos. Insira-os na página do devido grupo de avaliação.';

        return hasAtLeastOneProject;
    }

    isPortfolioSelectedValid(): boolean {
        return this.isPortfolioSelected();
    }

    isEvaluationGroupSelectedValid(): boolean {
        return this.isEvaluationGroupSelected()
            && this.doesSelectedEvaluationGroupHaveAtLeastOneProject();
    }

    isPortfolioSelected(): boolean {
        let isPortfolioSelected = !!this.inputPortfolioSelectedId.trim();

        this.errorMessage = isPortfolioSelected ? '' : 'Os campos marcados com * são obrigatórios.';

        return isPortfolioSelected;
    }

    isEvaluationGroupSelected(): boolean {
        let isEvaluationGroupSelected = !!this.inputEvaluationGroupSelectedId.trim();

        this.errorMessage = isEvaluationGroupSelected ? '' : 'Os campos marcados com * são obrigatórios.';

        return isEvaluationGroupSelected;
    }

    getSelectedEvaluationGroupObject(): EvaluationGroup | undefined {
        return this.inputEvaluationGroupOptions.find(evaluationGroup => evaluationGroup.id == Number(this.inputEvaluationGroupSelectedId));
    }

    setInputPortfolioOptions() {
        this.scenarioService.getAllPortfoliosNotCancelled().subscribe(portfolios => {
            this.inputPortfolioOptions = portfolios;

            if (!portfolios.length) {
                this.errorMessage = 'Nenhum portfólio foi cadastrado. Realize seu cadastro na página de portfólios.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }

    setInputEvaluationGroupOptions() {
        this.scenarioService.getAllEvaluationGroups(this.strategyId).subscribe(evaluationGroups => {
            this.inputEvaluationGroupOptions = evaluationGroups;

            if (!evaluationGroups.length) {
                this.errorMessage = 'Nenhum grupo de avaliação foi cadastrado. Realize seu cadastro na aba de grupos de avaliação.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }

    onBudgetKeyDown(event: KeyboardEvent) {
        handleScenarioBudgetKeyDown(
            event,
            () => this.inputBudget,
            v => this.inputBudget = v
        );
    }

    parseBudgetToNumber(formatted: string): number {
        // Remove pontos, troca vírgula por ponto, converte para float
        if (!formatted) return 0;
        const normalized = formatted.replace(/\./g, '').replace(',', '.');
        return parseFloat(normalized);
    }
}
