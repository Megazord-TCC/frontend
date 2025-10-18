import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EvaluationGroup, Portfolio } from '../../interface/carlos-interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ScenarioService } from '../../service/scenario-service';
import { ScenarioReadDTO, ScenarioUpdateDTO } from '../../interface/carlos-scenario-dtos';

@Component({
    selector: 'app-scenario-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './scenario-edit-modal.component.html',
    styleUrl: './scenario-edit-modal.component.scss'
})
export class ScenarioEditModal {
    @Input() isVisible = false;

    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    strategyId = 0;
    scenarioId = 0;

    showValidationError = false;

    inputName = '';
    inputDescription = '';
    inputPortfolioSelectedId = '';
    inputEvaluationGroupSelectedId = '';

    inputPortfolioOptions: Portfolio[] = [];
    inputEvaluationGroupOptions: EvaluationGroup[] = [];

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.scenarioId = Number(this.route.snapshot.paramMap.get('cenarioId'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.setInputPortfolioOptions();
        this.setInputEvaluationGroupOptions();
        this.loadScenarioDataByHttpRequest();
    }

    loadScenarioDataByHttpRequest() {
        this.scenarioService.getScenarioById(this.strategyId, this.scenarioId).subscribe((scenario: ScenarioReadDTO) => {
            this.inputName = scenario.name;
            this.inputDescription = scenario.description;
            this.inputPortfolioSelectedId = '1'; // TODO: Quando backend trazer portfólio: scenario.portfolioId.toString();
            this.inputEvaluationGroupSelectedId = scenario.evaluationGroup.id.toString();
        });
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

        let scenario = await firstValueFrom(this.scenarioService.getScenarioById(this.strategyId, this.scenarioId)) as ScenarioReadDTO;

        const body: ScenarioUpdateDTO = {
            name: this.inputName,
            description: this.inputDescription,
            budget: scenario.budget,
            status: scenario.status,
            // portfolioId: scenario?.portfolio?.id ?? 0 // O DTO do backend não aceita o portfolioId e dá erro.
        };

        this.scenarioService
            .updateScenario(this.strategyId, this.scenarioId, body)
            .subscribe({
                next: () => this.onClose(),
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
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isNameFilled() && await this.isNameUnique();
    }

    isNameFilled(): boolean {
        let isNameFilled = !!this.inputName.trim();

        this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';

        return isNameFilled;
    }

    async isNameUnique(): Promise<boolean> {
        let scenarioWithSameName = await firstValueFrom(this.scenarioService.getScenarioByExactName(this.strategyId, this.inputName));

        // Não existe cenário com esse nome.
        if (!scenarioWithSameName)
            return true;

        // O nome do cenário atual não foi alterado.
        if (scenarioWithSameName?.id == this.scenarioId) 
            return true;

        this.errorMessage = 'Nome já cadastrado.';
        return false;
    }

    setInputPortfolioOptions() {
        this.scenarioService.getAllPortfolios().subscribe(portfolios => {
            this.inputPortfolioOptions = portfolios;

            if (!portfolios.length) {
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }

    setInputEvaluationGroupOptions() {
        this.scenarioService.getAllEvaluationGroups(this.strategyId).subscribe(evaluationGroups => {
            this.inputEvaluationGroupOptions = evaluationGroups;

            if (!evaluationGroups.length) {
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }
}
