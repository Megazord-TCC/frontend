import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';
import { CategoryService } from '../../service/category-service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
    selector: 'app-category-edit-delete-modal',
    imports: [
        CommonModule, 
        FormsModule,
        SvgIconComponent
    ],
    templateUrl: './category-edit-delete-modal.component.html',
    styleUrl: './category-edit-delete-modal.component.scss'
})
export class CategoryEditDeleteModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) categoryId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() categoryUpdatedOrDeleted = new EventEmitter<void>();

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

    isSubmitButtonDisabled = true;

    mouseDownOnOverlay = false;

    routeSubscription?: Subscription;

    async ngOnInit() {
        this.restartForm();
    }

    loadFormDataByHttpRequest() {
        this.categoryService.getCategoryById(this.portfolioId, this.categoryId).subscribe({
            next: category => {
                this.inputName = category.name;
                this.inputDescription = category.description || '';
                this.isSubmitButtonDisabled = false;
            },
            error: _ => { 
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                this.isSubmitButtonDisabled = true;
            }
        });
    }

    restartForm() {
        this.loadFormDataByHttpRequest();
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

        this.categoryService.updateScenario(this.portfolioId, this.categoryId, this.inputName, this.inputDescription).subscribe({
            next: _ => this.categoryUpdatedOrDeleted.emit(),
            error: _ => { 
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.' 
                this.isSubmitButtonDisabled = true;
            },
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
        let foundCategory = await firstValueFrom(this.categoryService.getCategoryByExactName(this.portfolioId, this.inputName));

        let categoryNameAlreadyExists = foundCategory && (foundCategory.id != this.categoryId);

        this.errorMessage = categoryNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !categoryNameAlreadyExists;
    }

    deleteCategory(): void {
        this.categoryService.deleteCategory(this.portfolioId, this.categoryId).subscribe({
            next: _ => this.categoryUpdatedOrDeleted.emit(),
            error: _ => {
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
            }
        });
    }
}
