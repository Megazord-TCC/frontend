import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-portfolio-communication-repository-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-communication-repository-edit-modal.component.html',
    styleUrl: './portfolio-communication-repository-edit-modal.component.scss'
})
export class PortfolioCommunicationRepositoryEditModalComponent {
    @Input({ required: true }) portfolioId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    portfolioService = inject(PortfolioService);

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
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(event => {
            this.inputDescription = event.communicationStorageDescription;
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
        this.portfolioService.updatePortfolioCommunicationStorageDescription(this.portfolioId, this.inputDescription).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputDescription = '';
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }
}
