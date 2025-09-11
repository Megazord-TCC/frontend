import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from '../../service/scenario-service';
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioStatusEnum } from '../../interface/carlos-scenario-dtos';
import { ProjectReadDTO } from '../../interface/carlos-project-dtos';
import { formatToBRL } from '../../helpers/money-helper';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-scenario-authorization-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './scenario-authorization-modal.component.html',
    styleUrl: './scenario-authorization-modal.component.scss'
})
export class ScenarioAuthorizationModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() scenarioAuthorized = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);
    portfolioService = inject(PortfolioService);

    scenario?: ScenarioReadDTO;

    scenarioRankingStatusEnum = ScenarioRankingStatusEnum;

    strategyId = 0;
    scenarioId = 0;

    errorMessage = '';

    projectsInPortfolioNotIncludedInScenario: { id: number, name: string }[] = [];

    isSubmitButtonDisabled = false;
    isCancelButtonVisible = true;
    mouseDownOnOverlay = false;

    confirmButtonLabel = 'Autorizar cenário';
    agreeWithProjectRemoval = false;
    agreeWithOverbudget = false;

    currentModalPage: 'includedProjects' | 'projectsToExclude' | 'overbudgetWarning'
        | 'categoryWarning' | 'inclusionWarning' | 'loading' = 'loading';

    async ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.scenarioId = Number(this.route.snapshot.paramMap.get('cenarioId'));


        this.scenarioService.getScenarioById(this.strategyId, this.scenarioId).subscribe({
            next: scenario => {
                this.scenario = scenario;
                this.chooseCorrectPanelToShowAndButtonConfigurations();
            },
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        });
    }

    chooseCorrectPanelToShowAndButtonConfigurations() {
        let portfolioId = this.scenario?.portfolio?.id;
        if (!portfolioId) {
            this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
            return;
        }

        this.portfolioService.getProjectNamesByPortfolioId(portfolioId).subscribe({
            next: projects => {
                if (this.isThereAtLeastOneProjectIncluded()) {
                    if (this.isThereAtLeastOneProjectWithoutCategory()) {
                        this.currentModalPage = 'categoryWarning';
                        this.isCancelButtonVisible = false;
                        this.confirmButtonLabel = 'Entendi';
                        return;
                    }

                    this.isCancelButtonVisible = true;
                    this.currentModalPage = 'includedProjects';

                    this.projectsInPortfolioNotIncludedInScenario = projects.filter(
                        project => !this.getIncludedProjects().some(includedProject => includedProject.id == project.id)
                    );

                    if (this.projectsInPortfolioNotIncludedInScenario.length || this.getIsScenarioBudgetLowerThanAllIncludedProjectsBudget())
                        this.confirmButtonLabel = 'Continuar';
                    else
                        this.confirmButtonLabel = 'Autorizar cenário';
                } else {
                    this.currentModalPage = 'inclusionWarning';
                    this.isCancelButtonVisible = false;
                    this.confirmButtonLabel = 'Entendi';
                }
            },
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
        });
    }

    isThereAtLeastOneProjectWithoutCategory(): boolean {
        return this.getIncludedProjectsWithoutCategory().length > 0;
    }

    isThereAtLeastOneProjectIncluded(): boolean {
        return this.getIncludedProjects().length > 0;
    }

    getScenarioBudgetFormattedToBRL(): string {
        return formatToBRL(this.scenario?.budget ?? 0);
    }

    getIncludedProjectsBudgetSum(): number {
        return this.getIncludedProjects().reduce((sum, project) => sum + (project.budget || 0), 0);
    }

    getTotalIncludedProjectsBudgetFormattedToBRL(): string {
        const total = this.getIncludedProjectsBudgetSum();
        return formatToBRL(total);
    }

    getDiffBetweenScenarioBudgetAndIncludedProjectsBudget(): string {
        if (!this.scenario) return '...';
        let difference = this.getIncludedProjectsBudgetSum() - this.scenario.budget;
        return formatToBRL(difference);
    }

    getIncludedProjects(): ProjectReadDTO[] {
        if (!this.scenario) return [];

        return this.scenario.scenarioRankings
            .filter(ranking =>
                ranking.status == ScenarioRankingStatusEnum.INCLUDED ||
                ranking.status == ScenarioRankingStatusEnum.MANUALLY_INCLUDED)
            .map(ranking => ranking.project);
    }

    getIncludedProjectsWithoutCategory(): ProjectReadDTO[] {
        if (!this.scenario) return [];

        let x = this.scenario.scenarioRankings
            .filter(ranking =>
                ranking.status == ScenarioRankingStatusEnum.INCLUDED ||
                ranking.status == ScenarioRankingStatusEnum.MANUALLY_INCLUDED)
            .filter(ranking => !ranking.portfolioCategory)
            .map(ranking => ranking.project);

        console.log(x);
        return x;
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

    getIsScenarioBudgetLowerThanAllIncludedProjectsBudget(): boolean {
        if (!this.scenario) return false;
        const totalIncludedProjectsBudget = this.getIncludedProjectsBudgetSum();
        return this.scenario.budget < totalIncludedProjectsBudget;
    }

    onConfirmButtonClick(): void {
        if (this.currentModalPage === 'categoryWarning' || this.currentModalPage === 'inclusionWarning') {
            this.onClose();
            return;
        }

        if (this.currentModalPage === 'includedProjects') {
            if (this.projectsInPortfolioNotIncludedInScenario.length) {
                this.currentModalPage = 'projectsToExclude';
                this.isSubmitButtonDisabled = true;
                this.agreeWithProjectRemoval = false;
                if (this.getIsScenarioBudgetLowerThanAllIncludedProjectsBudget())
                    this.confirmButtonLabel = 'Continuar';
                else 
                    this.confirmButtonLabel = 'Autorizar cenário';
                return;
            }
            if (this.getIsScenarioBudgetLowerThanAllIncludedProjectsBudget()) {
                this.currentModalPage = 'overbudgetWarning';
                this.confirmButtonLabel = 'Autorizar cenário';
                this.isSubmitButtonDisabled = true;
                this.agreeWithProjectRemoval = false;
                return;
            }
        }
        if (this.currentModalPage === 'projectsToExclude' && this.getIsScenarioBudgetLowerThanAllIncludedProjectsBudget()) {
            this.currentModalPage = 'overbudgetWarning';
            this.confirmButtonLabel = 'Autorizar cenário';
            this.isSubmitButtonDisabled = true;
            this.agreeWithProjectRemoval = false;
            return;
        }

        this.sendScenarioAuthorizationHttpRequest();
    }

    agreeWithProjectCheckboxChange() {
        if (this.agreeWithProjectRemoval) {
            this.isSubmitButtonDisabled = false;
        } else {
            this.isSubmitButtonDisabled = true;
        }
    }

    agreeWithOverbudgetCheckboxChange() {
        if (this.agreeWithOverbudget) {
            this.isSubmitButtonDisabled = false;
        } else {
            this.isSubmitButtonDisabled = true;
        }
    }

    sendScenarioAuthorizationHttpRequest() {
        this.scenarioService
            .authorizeCenario(this.strategyId, this.scenarioId)
            .subscribe({
                next: _ => this.scenarioAuthorized.emit(),
                error: _ => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.'
                },
            });
    }

}
