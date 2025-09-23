import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mapPortfolioLevelScaleToBadgeColor } from '../../../../mappers/portfolio-stakeholder-mappers';
import { TableComponent } from '../../../../components/table/table.component';
import { getActionButton, getColumns, getFilterText } from './portfolio-event-detail-participants-tab-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { map, Observable } from 'rxjs';
import { PortfolioEventParticipantService } from '../../../../service/portfolio-event-participant-service';
import { mapEventParticipantReadDTOPageToEventParticipantTableRowPage } from '../../../../mappers/portfolio-event-participant-mappers';
import { PortfolioParticipantCreateModalComponent } from '../../../../components/event-participant-create-modal/portfolio-participant-create-modal.component';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-event-detail-participants-tab',
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        PortfolioParticipantCreateModalComponent
    ],
    templateUrl: './portfolio-event-detail-participants-tab.component.html',
    styleUrl: './portfolio-event-detail-participants-tab.component.scss'
})
export class PortfolioEventDetailParticipantsTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;
    
    actionButton = getActionButton();
    filterText = getFilterText();
    columns = getColumns();

    showCreateModal = false;
    showEditModal = false;

    portfolioId = 0;
    eventId = 0;

    portfolioEventParticipantService = inject(PortfolioEventParticipantService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    mapToBadgeColor = mapPortfolioLevelScaleToBadgeColor;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.eventId = Number(this.route.snapshot.paramMap.get('eventoId'));
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.portfolioEventParticipantService.getParticipantsPage(this.portfolioId, this.eventId, queryParams)
            .pipe(map(page => mapEventParticipantReadDTOPageToEventParticipantTableRowPage(page)))
    );
}
