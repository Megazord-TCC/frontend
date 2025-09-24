import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioEventsService } from '../../service/portfolio-events-service';

@Component({
    selector: 'app-event-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './event-delete-modal.component.html',
    styleUrl: './event-delete-modal.component.scss'
})
export class EventDeleteModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) eventId = 0;
    
    @Output() close = new EventEmitter<void>();

    router = inject(Router);
    eventService = inject(PortfolioEventsService);

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) {
            this.onClose();
        }
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
        this.eventService
            .deleteEvent(this.portfolioId, this.eventId)
            .subscribe({
                next: _ => this.router.navigate([`/portfolio/${this.portfolioId}`]),
                error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
    }
}
