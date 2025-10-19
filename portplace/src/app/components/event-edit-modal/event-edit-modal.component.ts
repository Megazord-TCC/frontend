import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PortfolioEventsService } from '../../service/portfolio-events-service';

@Component({
    selector: 'app-event-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './event-edit-modal.component.html',
    styleUrl: './event-edit-modal.component.scss'
})
export class EventEditModal {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) eventId = 0;

    @Output() close = new EventEmitter<void>();
    @Output() eventEdit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    portfolioEventsService = inject(PortfolioEventsService);

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
        this.portfolioEventsService.getPortfolioEventById(this.portfolioId, this.eventId).subscribe(event => {
            this.inputName = event.name;
            this.inputDescription = event.description;
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

        this.portfolioEventsService.updateEventBasicInformation(this.portfolioId, this.eventId, this.inputName, this.inputDescription).subscribe({
            next: _ => this.eventEdit.emit(),
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
        let event = await firstValueFrom(
            this.portfolioEventsService.getEventByExactName(this.portfolioId, this.inputName)
        );

        let eventNameAlreadyExists = event && (event.id != this.eventId);

        this.errorMessage = eventNameAlreadyExists ? 'Nome já cadastrado.' : '';

        return !eventNameAlreadyExists;
    }
}
