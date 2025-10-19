import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PortfolioStakeholdersService } from '../../service/portfolio-stakeholders-service';

@Component({
    selector: 'app-stakeholder-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './stakeholder-edit-modal.component.html',
    styleUrl: './stakeholder-edit-modal.component.scss'
})
export class StakeholderEditModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) stakeholderId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() eventEdit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);

    inputName = '';

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
        this.portfolioStakeholdersService.getStakeholderById(this.portfolioId, this.stakeholderId).subscribe(stakeholder => {
            this.inputName = stakeholder.name;
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
        let isFormValid = await this.isFormValid();
        if (!isFormValid) return;

        this.portfolioStakeholdersService.updateStakeholderBasicInformation(this.portfolioId, this.stakeholderId, this.inputName).subscribe({
            next: _ => this.eventEdit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputName = '';
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
        let stakeholder = await firstValueFrom(
            this.portfolioStakeholdersService.getStakeholderByExactName(this.portfolioId, this.inputName)
        );

        let stakeholderNameAlreadyExists = stakeholder && (stakeholder.id != this.stakeholderId);
        this.errorMessage = stakeholderNameAlreadyExists ? 'Nome já cadastrado.' : '';
        return !stakeholderNameAlreadyExists;
    }
}
