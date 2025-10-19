import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EventPeriodicity } from '../../interface/carlos-portfolio-events-interfaces';
import { PortfolioLevelScale, PortfolioScaleEnumDTO, StakeholderReadDTO } from '../../interface/carlos-portfolio-stakeholders-interfaces';
import { PortfolioStakeholdersService } from '../../service/portfolio-stakeholders-service';
import { mapPortfolioLevelScaleToPortfolioScaleEnumDTO, mapPortfolioScaleEnumDTOToPortfolioLevelScale } from '../../mappers/portfolio-stakeholder-mappers';

@Component({
    selector: 'app-stakeholder-about-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './stakeholder-about-edit-modal.component.html',
    styleUrl: './stakeholder-about-edit-modal.component.scss'
})
export class StakeholderAboutEditModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);

    portfolioId = 0;
    stakeholderId = 0;

    powerLevelSelected = PortfolioLevelScale.LOW;
    powerLevelOptions: PortfolioLevelScale[] = [PortfolioLevelScale.LOW, PortfolioLevelScale.MEDIUM, PortfolioLevelScale.HIGH];
    inputPowerLevelJustification = '';

    interestLevelSelected = PortfolioLevelScale.LOW;
    interestLevelOptions: PortfolioLevelScale[] = [PortfolioLevelScale.LOW, PortfolioLevelScale.MEDIUM, PortfolioLevelScale.HIGH];
    inputInterestLevelJustification = '';

    inputExpectations = '';
    inputSupervisorsObligationWithStakeholder = '';
    inputPositivePoints = '';
    inputNegativePoints = '';

    showValidationError = false;
    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    eventPeriodicity = EventPeriodicity;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.stakeholderId = Number(this.route.snapshot.paramMap.get('interessadoId'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.portfolioStakeholdersService.getStakeholderById(this.portfolioId, this.stakeholderId).subscribe((stakeholder: StakeholderReadDTO) => {
            this.inputPowerLevelJustification = stakeholder.powerLevelJustification;
            this.powerLevelSelected = mapPortfolioScaleEnumDTOToPortfolioLevelScale(stakeholder.powerLevel) ?? PortfolioLevelScale.LOW;
            this.inputInterestLevelJustification = stakeholder.interestLevelJustification;
            this.interestLevelSelected = mapPortfolioScaleEnumDTOToPortfolioLevelScale(stakeholder.interestLevel) ?? PortfolioLevelScale.LOW;
            this.inputExpectations = stakeholder.expectations;
            this.inputSupervisorsObligationWithStakeholder = stakeholder.obligationsWithStakeholder;
            this.inputPositivePoints = stakeholder.positivePoints;
            this.inputNegativePoints = stakeholder.negativePoints;
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
        this.portfolioStakeholdersService.updateStakeholderAnalysisInformation(
            this.portfolioId, 
            this.stakeholderId, 
            mapPortfolioLevelScaleToPortfolioScaleEnumDTO(this.powerLevelSelected) ?? PortfolioScaleEnumDTO.LOW,
            mapPortfolioLevelScaleToPortfolioScaleEnumDTO(this.interestLevelSelected) ?? PortfolioScaleEnumDTO.LOW,
            this.inputPowerLevelJustification,
            this.inputInterestLevelJustification,
            this.inputExpectations,
            this.inputSupervisorsObligationWithStakeholder,
            this.inputPositivePoints,
            this.inputNegativePoints
        ).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.powerLevelSelected = PortfolioLevelScale.LOW;
        this.interestLevelSelected = PortfolioLevelScale.LOW;
        this.inputPowerLevelJustification = '';
        this.inputInterestLevelJustification = '';
        this.inputExpectations = '';
        this.inputSupervisorsObligationWithStakeholder = '';
        this.inputPositivePoints = '';
        this.inputNegativePoints = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }
}
