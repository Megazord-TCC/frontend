import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskScale, RiskScaleEnumDTO } from '../../interface/carlos-risk-interfaces';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';
import { mapRiskScaleEnumDTOToRiskScale, mapRiskScaleToRiskScaleEnumDTO } from '../../mappers/carlos-risks-mappers';

@Component({
    selector: 'app-risk-analysis-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './risk-analysis-edit-modal.component.html',
    styleUrl: './risk-analysis-edit-modal.component.scss'
})
export class RiskAnalysisEditModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    riskService = inject(CarlosPortfolioRisksService);

    portfolioId = 0;
    riskId = 0;
    
    inputProbabilitySelected = RiskScale.LOW;
    inputProbabilityJustification = '';

    inputImpactSelected = RiskScale.LOW;
    inputImpactJustification = '';

    preventionPlan = '';
    contingencyPlan = '';
    
    riskOptions: RiskScale[] = Object.values(RiskScale);

    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    showValidationError = false;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.riskId = Number(this.route.snapshot.paramMap.get('riscoId'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.riskService.getRiskById(this.portfolioId, this.riskId).subscribe(risk => {
            this.inputProbabilitySelected = mapRiskScaleEnumDTOToRiskScale(risk.probability) ?? RiskScale.LOW;
            this.inputProbabilityJustification = risk.probabilityDescription;
            this.inputImpactSelected = mapRiskScaleEnumDTOToRiskScale(risk.impact) ?? RiskScale.LOW;
            this.inputImpactJustification = risk.impactDescription;
            this.preventionPlan = risk.preventionPlan;
            this.contingencyPlan = risk.contingencyPlan;
        });
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        this.riskService.updateRiskAnalysisById(
            this.portfolioId,
            this.riskId,
            mapRiskScaleToRiskScaleEnumDTO(this.inputProbabilitySelected) ?? RiskScaleEnumDTO.LOW,
            this.inputProbabilityJustification,
            mapRiskScaleToRiskScaleEnumDTO(this.inputImpactSelected) ?? RiskScaleEnumDTO.LOW,
            this.inputImpactJustification,
            this.preventionPlan,
            this.contingencyPlan
        ).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputProbabilitySelected = RiskScale.LOW;
        this.inputProbabilityJustification = '';
        this.inputImpactSelected = RiskScale.LOW;
        this.inputImpactJustification = '';
        this.preventionPlan = '';
        this.contingencyPlan = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }
}
