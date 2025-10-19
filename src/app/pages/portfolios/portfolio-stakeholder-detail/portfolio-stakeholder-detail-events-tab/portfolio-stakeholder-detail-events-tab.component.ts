import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioStakeholdersService } from '../../../../service/portfolio-stakeholders-service';
import { mapEventReadDTOPageToPortfolioStakeholderEventTableRowPage } from '../../../../mappers/portfolio-stakeholder-mappers';
import { getColumns, getFilterText } from './portfolio-stakeholder-detail-events-tab-table-config';
import { TableComponent } from '../../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { map, Observable } from 'rxjs';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-stakeholder-detail-events-tab',
    imports: [
        CommonModule,
        FormsModule,
        TableComponent
    ],
    templateUrl: './portfolio-stakeholder-detail-events-tab.component.html',
    styleUrl: './portfolio-stakeholder-detail-events-tab.component.scss'
})
export class PortfolioStakeholderDetailEventsTabComponent {
    filterText = getFilterText();
    columns = getColumns();

    portfolioId = 0;
    stakeholderId = 0;

    portfolioStakeholdersService = inject(PortfolioStakeholdersService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.stakeholderId = Number(this.route.snapshot.paramMap.get('interessadoId'));
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.portfolioStakeholdersService.getEventsByStakeholderId(this.portfolioId, this.stakeholderId, queryParams)
            .pipe(map(page => mapEventReadDTOPageToPortfolioStakeholderEventTableRowPage(page)))
    );
}
