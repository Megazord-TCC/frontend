import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from '../../service/scenario-service';
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioStatusEnum } from '../../interface/carlos-scenario-dtos';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-cancel-scenario-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './cancel-scenario-modal.component.html',
    styleUrl: './cancel-scenario-modal.component.scss'
})
export class CancelScenarioModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() scenarioCancelled = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    scenario?: ScenarioReadDTO;

    strategyId = 0;
    scenarioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    async ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.scenarioId = Number(this.route.snapshot.paramMap.get('cenarioId'));
        this.scenario = await firstValueFrom(this.scenarioService.getScenarioById(this.strategyId, this.scenarioId));
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
        if (!this.scenario) {
            this.isSubmitButtonDisabled = true;
            this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
            return;
        }

        let body = {
            name: this.scenario.name,
            description: this.scenario.description,
            budget: this.scenario.budget,
            status: ScenarioStatusEnum.CANCELLED
        };

        this.scenarioService
            .updateScenario(this.strategyId, this.scenarioId, body)
            .subscribe({
                next: _ => this.scenarioCancelled.emit(),
                error: _ => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.'
                },
            });
    }

}
