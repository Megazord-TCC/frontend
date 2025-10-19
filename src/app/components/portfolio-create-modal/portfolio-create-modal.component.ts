import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-portfolio-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-create-modal.component.html',
    styleUrl: './portfolio-create-modal.component.scss'
})
export class PortfolioCreateModal {
    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);

    showValidationError = false;

    inputName = '';
    inputDescription = '';

    errorMessage = '';

    isSubmitButtonDisabled = false;

    mouseDownOnOverlay = false;

    ngOnInit() {
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) 
            this.onClose();

        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget)
            this.mouseDownOnOverlay = true;
    }

    onClose(): void {
        this.close.emit();
    }

    async onSave(): Promise<any> {
        let isFormValid = await this.isFormValid();

        if (!isFormValid)
            return;

        this.portfolioService.createPortfolio(this.inputName, this.inputDescription).subscribe({
            next: (createdScenarioId: number) => this.goToPortfolioDetailPage(createdScenarioId),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    goToPortfolioDetailPage(portfolioId: number) {
        this.router.navigate([`/portfolio/${portfolioId}`]);
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
        let portfolioNameAlreadyExists = await firstValueFrom(this.portfolioService.getPortfolioByExactName(this.inputName));

        this.errorMessage = portfolioNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !portfolioNameAlreadyExists;
    }
}
