import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';
import { PortfolioReadDTO, PortfolioUpdateDTO } from '../../interface/carlos-portfolio-interfaces';

@Component({
    selector: 'app-portfolio-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-edit-modal.component.html',
    styleUrl: './portfolio-edit-modal.component.scss'
})
export class PortfolioEditModalComponent {
    @Output() close = new EventEmitter<void>();

    @Output() portfolioEdited = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);

    portfolioId = 0;

    inputName = '';
    inputDescription = '';

    portfolioDTO?: PortfolioReadDTO;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('id'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.loadPortfolioDataByHttpRequest();
    }

    loadPortfolioDataByHttpRequest() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe((portfolio: PortfolioReadDTO) => {
            this.inputName = portfolio.name;
            this.inputDescription = portfolio.description;
            this.portfolioDTO = portfolio;
        });
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay)
            this.onClose();

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

        const body: PortfolioUpdateDTO = {
            name: this.inputName,
            description: this.inputDescription,
            communicationStorageDescription: this.portfolioDTO?.communicationStorageDescription || ''
        };

        this.portfolioService
            .updatePortfolio(this.portfolioId, body)
            .subscribe({
                next: () => this.portfolioEdited.emit(),
                error: () => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
    }

    clearForm() {
        this.inputName = '';
        this.inputDescription = '';
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
        let portfolioFound = await firstValueFrom(this.portfolioService.getPortfolioByExactName(this.inputName));

        if (!portfolioFound)
            return true;

        // O nome do portfólio atual não foi alterado.
        if (portfolioFound.id == this.portfolioId)
            return true;

        this.errorMessage = 'Nome já cadastrado.';
        return false;
    }
}
