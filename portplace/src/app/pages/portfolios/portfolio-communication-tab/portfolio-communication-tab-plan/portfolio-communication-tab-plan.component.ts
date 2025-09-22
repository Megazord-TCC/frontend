import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { getActionButton, getColumns, getFilterText } from './portfolio-communication-tab-plan-table-config';
import { TableComponent } from '../../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { mapEventReadDTOPageToUserTableRowPage } from '../../../../mappers/portfolio-events-mappers';
import { PortfolioEventsService } from '../../../../service/portfolio-events-service';
import { EventCreateModal } from '../../../../components/event-create-modal/event-create-modal.component';

@Component({
    selector: 'app-portfolio-communication-tab-plan',
    templateUrl: './portfolio-communication-tab-plan.component.html',
    styleUrls: ['./portfolio-communication-tab-plan.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        EventCreateModal
    ],
    standalone: true
})
export class PortfolioCommunicationTabPlanComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private portfolioEventsService = inject(PortfolioEventsService);
    private routeSubscription?: Subscription;

    actionButton = getActionButton();
    filterText = getFilterText();
    columns = getColumns();

    isCreateModalVisible = false;

    portfolioId = 0;

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.portfolioId = Number(params.get('id'));
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.portfolioEventsService.getPortfolioEventsPage(this.portfolioId, queryParams)
            .pipe(map(page => (mapEventReadDTOPageToUserTableRowPage(page))))
    );

    navigateToEventDetailPage(eventId: number) {
        this.router.navigate([`/portfolio/${this.portfolioId}/evento/${eventId}`]);
    }
}