import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';
import { CarlosPortfolioRiskOccurrenceService } from '../../service/carlos-portfolio-risks-occurrence.service';

@Component({
    selector: 'app-risk-occurrence-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './risk-occurrence-create-modal.component.html',
    styleUrl: './risk-occurrence-create-modal.component.scss'
})
export class RiskOccurrenceCreateModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) riskId = 0;

    @Output() create = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    riskService = inject(CarlosPortfolioRisksService);
    occurrenceService = inject(CarlosPortfolioRiskOccurrenceService);

    riskName = '';

    inputOccurrenceDate = '';
    inputOccurrenceDescription = '';
    inputResolutionDate = '';
    inputIsOccurrenceResolved = '';

    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.restartForm();
    }

    restartForm() {
        this.getRiskNameByHttpRequest();
        this.clearForm();
    }

    onCheckboxChange() {
        if (!this.inputIsOccurrenceResolved) this.inputIsOccurrenceResolved = '';
    }

    getRiskNameByHttpRequest() {
        this.riskService.getRiskById(this.portfolioId, this.riskId).subscribe(risk => this.riskName = risk.name);
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();;
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        let isFormValid = await this.isFormValid();
        if (!isFormValid) return;

        this.occurrenceService.createRiskOccurrence(
            this.portfolioId, 
            this.riskId, 
            this.inputOccurrenceDate, 
            this.inputOccurrenceDescription, 
            this.inputIsOccurrenceResolved ? this.inputResolutionDate : undefined
        ).subscribe({
            next: _ => this.create.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputOccurrenceDescription = '';
        this.inputOccurrenceDate = '';
        this.inputResolutionDate = '';
        this.inputIsOccurrenceResolved = '';
        this.inputOccurrenceDescription = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isOccurrenceDateFilled()
            && this.isOccurrenceResolutionValid();
    }

    isOccurrenceDateFilled(): boolean {
        let isOccurrenceDateFilled = !!this.inputOccurrenceDate.trim();
        this.errorMessage = isOccurrenceDateFilled ? '' : 'Os campos marcados com * são obrigatórios.';
        return isOccurrenceDateFilled;
    }

    isOccurrenceResolutionValid(): boolean {
        let isOccurrenceResolutionValid = !this.inputIsOccurrenceResolved || !!this.inputResolutionDate.trim();
        this.errorMessage = isOccurrenceResolutionValid ? '' : 'Os campos marcados com * são obrigatórios.';
        return isOccurrenceResolutionValid;
    }
}
