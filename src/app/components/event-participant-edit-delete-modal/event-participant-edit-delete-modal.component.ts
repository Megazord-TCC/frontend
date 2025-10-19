import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PortfolioEventsService } from '../../service/portfolio-events-service';
import { PortfolioEventParticipantService } from '../../service/portfolio-event-participant-service';
import { EventParticipantReadDTO } from '../../interface/carlos-portfolio-event-participant-interfaces';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
    selector: 'app-event-participant-edit-delete-modal',
    imports: [
        CommonModule, 
        FormsModule,
        SvgIconComponent
    ],
    templateUrl: './event-participant-edit-delete-modal.component.html',
    styleUrl: './event-participant-edit-delete-modal.component.scss'
})
export class EventParticipantEditDeleteModalComponent {
    @Input({ required: true }) participantId = 0;

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    httpClient = inject(HttpClient);
    portfolioEventParticipantService = inject(PortfolioEventParticipantService);
    portfolioEventService = inject(PortfolioEventsService);

    inputIsResponsible = false;

    portfolioId = 0;
    eventId = 0;
    eventName = '...';

    participant?: EventParticipantReadDTO;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.clearForm();
            this.portfolioId = Number(params.get('portfolioId'));
            this.eventId = Number(params.get('eventoId'));
            this.loadEventNameByHttpRequest();
            this.loadParticipantNameAndResponsibilityByHttpRequest();
        });
    }

    loadEventNameByHttpRequest() {
        this.portfolioEventService.getPortfolioEventById(this.portfolioId, this.eventId).subscribe(event => {
            this.eventName = event.name;
        });
    }

    loadParticipantNameAndResponsibilityByHttpRequest() {
        this.portfolioEventParticipantService.getParticipantById(
            this.portfolioId,
            this.eventId,
            this.participantId
        ).subscribe(participant => {
            this.participant = participant;
            this.inputIsResponsible = participant.responsible;
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onEdit(): Promise<any> {
        this.portfolioEventParticipantService.updateParticipantResponsibility(
            this.portfolioId,
            this.eventId,
            this.participant?.id || 0,
            this.inputIsResponsible
        ).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    onDelete() {
        this.portfolioEventParticipantService.removeParticipantFromEvent(
            this.portfolioId,
            this.eventId,
            this.participant?.id || 0
        ).subscribe({
            next: _ => this.delete.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.eventName = '';
        this.participant = undefined;
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }
}
