import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationMethodDTO, EventPeriodicity, EventReadDTO } from '../../interface/carlos-portfolio-events-interfaces';
import { PortfolioEventsService } from '../../service/portfolio-events-service';
import { mapEventPeriodicityDTOToEventPeriodicity } from '../../mappers/portfolio-events-mappers';

@Component({
    selector: 'app-event-about-edit-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './event-about-edit-modal.component.html',
    styleUrl: './event-about-edit-modal.component.scss'
})
export class EventAboutEditModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() edit = new EventEmitter<void>();

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);
    eventService = inject(PortfolioEventsService);

    portfolioId = 0;
    eventId = 0;

    showValidationError = false;

    inputRequiredDocumentsAndGeneralInfo = '';
    inputDiscussionTopic = '';
    inputEventReason = '';
    inputUsesCommunicationMethodEmail = false;
    inputUsesCommunicationMethodOnlineMeeting = false;
    inputUsesCommunicationMethodOnSiteMeeting = false;

    inputPeriodicitySelected = EventPeriodicity.UNDEFINED;
    inputPeriodicityOptions: EventPeriodicity[] = Object.values(EventPeriodicity);

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    eventPeriodicity = EventPeriodicity;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.eventId = Number(this.route.snapshot.paramMap.get('eventoId'));
        this.restartForm();
    }

    restartForm() {
        this.clearForm();
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.eventService.getPortfolioEventById(this.portfolioId, this.eventId).subscribe((event: EventReadDTO) => {
            this.inputRequiredDocumentsAndGeneralInfo = event.infosAndDocs;
            this.inputDiscussionTopic = event.discussionTopic;
            this.inputEventReason = event.reason;
            this.inputPeriodicitySelected = mapEventPeriodicityDTOToEventPeriodicity(event.periodicity);
            this.inputUsesCommunicationMethodEmail = !!event.communicationMethods?.includes(CommunicationMethodDTO.EMAIL);
            this.inputUsesCommunicationMethodOnlineMeeting = !!event.communicationMethods?.includes(CommunicationMethodDTO.ONLINE_MEETING);
            this.inputUsesCommunicationMethodOnSiteMeeting = !!event.communicationMethods?.includes(CommunicationMethodDTO.ON_SITE_MEETING);
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
        if (!this.isFormValid()) return;

        this.eventService.updateEventAboutInformation(
            this.portfolioId,
            this.eventId,
            this.inputRequiredDocumentsAndGeneralInfo,
            this.inputDiscussionTopic,
            this.inputEventReason,
            this.inputPeriodicitySelected,
            this.inputUsesCommunicationMethodEmail,
            this.inputUsesCommunicationMethodOnlineMeeting,
            this.inputUsesCommunicationMethodOnSiteMeeting
        ).subscribe({
            next: _ => this.edit.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    isFormValid(): boolean {
        let isValid = this.inputPeriodicitySelected != EventPeriodicity.UNDEFINED;

        this.errorMessage = 'Os campos marcados com * são obrigatórios.';

        return isValid;
    }

    clearForm() {
        this.inputRequiredDocumentsAndGeneralInfo = '';
        this.inputDiscussionTopic = '';
        this.inputEventReason = '';
        this.inputUsesCommunicationMethodEmail = false;
        this.inputUsesCommunicationMethodOnlineMeeting = false;
        this.inputUsesCommunicationMethodOnSiteMeeting = false;
        this.inputPeriodicitySelected = EventPeriodicity.UNDEFINED;
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }
}
