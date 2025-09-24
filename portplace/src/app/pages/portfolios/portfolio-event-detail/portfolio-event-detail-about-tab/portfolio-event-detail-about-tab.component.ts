import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommunicationMethod, CommunicationMethodDTO, EventPeriodicity, EventReadDTO } from '../../../../interface/carlos-portfolio-events-interfaces';
import { EventAboutEditModalComponent } from '../../../../components/event-about-edit-modal/event-about-edit-modal.component';
import { PortfolioEventsService } from '../../../../service/portfolio-events-service';
import { mapEventPeriodicityDTOToEventPeriodicity } from '../../../../mappers/portfolio-events-mappers';
import { ActivatedRoute } from '@angular/router';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-event-detail-about-tab',
    imports: [
        CommonModule,
        FormsModule,
        EventAboutEditModalComponent
    ],
    templateUrl: './portfolio-event-detail-about-tab.component.html',
    styleUrl: './portfolio-event-detail-about-tab.component.scss'
})
export class PortfolioEventDetailAboutTabComponent {
    requiredDocumentsAndGeneralInfo = '';
    discussionTopic = '';
    eventReason = '';
    communicationMethods: CommunicationMethod[] = [];
    periodicity = EventPeriodicity.UNDEFINED;

    showEditModal = false;

    portfolioId = 0;
    eventId = 0;

    eventService = inject(PortfolioEventsService);
    route = inject(ActivatedRoute);

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.eventId = Number(this.route.snapshot.paramMap.get('eventoId'));
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.eventService.getPortfolioEventById(this.portfolioId, this.eventId).subscribe((event: EventReadDTO) => {
            this.requiredDocumentsAndGeneralInfo = event.infosAndDocs;
            this.discussionTopic = event.discussionTopic;
            this.eventReason = event.reason;
            this.periodicity = mapEventPeriodicityDTOToEventPeriodicity(event.periodicity);
            this.communicationMethods = [];
            if(event.communicationMethods?.includes(CommunicationMethodDTO.EMAIL)) this.communicationMethods.push(CommunicationMethod.EMAIL);
            if(event.communicationMethods?.includes(CommunicationMethodDTO.ONLINE_MEETING)) this.communicationMethods.push(CommunicationMethod.ONLINE_MEETING);
            if(event.communicationMethods?.includes(CommunicationMethodDTO.ON_SITE_MEETING)) this.communicationMethods.push(CommunicationMethod.ON_SITE_MEETING);
        });
    }
}
