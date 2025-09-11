import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';
import { CategoryService } from '../../service/category-service';

@Component({
    selector: 'app-category-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './category-create-modal.component.html',
    styleUrl: './category-create-modal.component.scss'
})
export class CategoryCreateModal {
    @Input({ required: true }) portfolioId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() categoryCreated = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);
    categoryService = inject(CategoryService);

    showValidationError = false;

    portfolioName = '';

    inputName = '';
    inputDescription = '';

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

        this.categoryService.createCategory(this.portfolioId, this.inputName, this.inputDescription).subscribe({
            next: _ => this.categoryCreated.emit(),
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
        let categoryNameAlreadyExists = await firstValueFrom(
            this.categoryService.getCategoryByExactName(this.portfolioId, this.inputName)
        );

        this.errorMessage = categoryNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !categoryNameAlreadyExists;
    }
}
