import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mapPortfolioLevelScaleToBadgeColor } from '../../../../mappers/portfolio-stakeholder-mappers';
import { TableComponent } from '../../../../components/table/table.component';
import { getActionButton, getColumns, getFilterText } from './portfolio-risk-detail-occurrences-tab-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { map, Observable, tap } from 'rxjs';
import { mapRiskOccurrenceReadDTOPageToRiskOccurrenceTableRowPage } from '../../../../mappers/carlos-risk-occurrences-mappers';
import { CarlosPortfolioRiskOccurrenceService } from '../../../../service/carlos-portfolio-risks-occurrence.service';
import { RiskOccurrenceCreateModalComponent } from '../../../../components/risk-occurrence-create-modal/risk-occurrence-create-modal.component';
import { RiskOccurrenceEditModalComponent } from '../../../../components/risk-occurrence-edit-modal/risk-occurrence-edit-modal.component';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-risk-detail-occurrences-tab',
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        RiskOccurrenceCreateModalComponent,
        RiskOccurrenceEditModalComponent
    ],
    templateUrl: './portfolio-risk-detail-occurrences-tab.component.html',
    styleUrl: './portfolio-risk-detail-occurrences-tab.component.scss'
})
export class PortfolioRiskDetailOccurrencesTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    @Output() change = new EventEmitter<void>();
    
    actionButton = getActionButton();
    filterText = getFilterText();
    columns = getColumns();

    showCreateModal = false;
    showEditModal = false;

    portfolioId = 0;
    riskId = 0;
    selectedParticipantId = 0;

    occurrenceService = inject(CarlosPortfolioRiskOccurrenceService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    mapToBadgeColor = mapPortfolioLevelScaleToBadgeColor;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.riskId = Number(this.route.snapshot.paramMap.get('riscoId'));
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.occurrenceService.getRiskOccurrencesPage(this.portfolioId, this.riskId, queryParams)
            .pipe(map(page => mapRiskOccurrenceReadDTOPageToRiskOccurrenceTableRowPage(page)))
    );
}
