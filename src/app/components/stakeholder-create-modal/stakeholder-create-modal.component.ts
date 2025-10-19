import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';
import { PortfolioStakeholdersService } from '../../service/portfolio-stakeholders-service';

@Component({
    selector: 'app-stakeholder-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './stakeholder-create-modal.component.html',
    styleUrl: './stakeholder-create-modal.component.scss'
})
export class StakeholderCreateModal {
    @Input({ required: true }) portfolioId = 0;

    @Output() close = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);

    portfolioName = '';

    inputName = '';

    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.restartForm();
    }

    restartForm() {
        this.getPortfolioNameByHttpRequest();
        this.clearForm();
    }

    getPortfolioNameByHttpRequest() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => this.portfolioName = portfolio.name);
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

        this.portfolioStakeholdersService.createNewStakeholder(this.portfolioId, this.inputName).subscribe({
            next: stakeholder => this.router.navigate([`/portfolio/${this.portfolioId}/interessado/${stakeholder.id}`]),
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
        let stakeholderNameAlreadyExists = await firstValueFrom(
            this.portfolioStakeholdersService.getStakeholderByExactName(this.portfolioId, this.inputName)
        );

        this.errorMessage = stakeholderNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !stakeholderNameAlreadyExists;
    }
}
