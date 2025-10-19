import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';

@Component({
    selector: 'app-risk-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './risk-edit-modal.component.html',
    styleUrl: './risk-edit-modal.component.scss'
})
export class RiskEditModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) riskId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    riskService = inject(CarlosPortfolioRisksService);

    inputName = '';
    inputDescription = '';

    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    async ngOnInit() {
        this.restartForm();
    }

    restartForm() {
        this.fillFormWithDataByHttpRequest();
        this.clearForm();
    }

    fillFormWithDataByHttpRequest() {
        this.riskService.getRiskById(this.portfolioId, this.riskId).subscribe(risk => {
            this.inputName = risk.name;
            this.inputDescription = risk.description;
        });
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) 
            this.close.emit();;

        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget)
            this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        let isFormValid = await this.isFormValid();
        if (!isFormValid) return;

        this.riskService.updateRiskBasicDataById(this.portfolioId, this.riskId, this.inputName, this.inputDescription).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputName = '';
        this.inputDescription = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isNameFilled()
            && await this.isNameUnique();
    }

    isNameFilled(): boolean {
        let isNameFilled = !!this.inputName.trim();

        this.errorMessage = isNameFilled ? '' : 'Os campos marcados com * são obrigatórios.';

        return isNameFilled;
    }

    async isNameUnique(): Promise<boolean> {
        let risk = await firstValueFrom(
            this.riskService.getRiskByExactName(this.portfolioId, this.inputName)
        );

        let riskNameAlreadyExists = risk && (risk.id != this.riskId);

        this.errorMessage = riskNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !riskNameAlreadyExists;
    }
}
