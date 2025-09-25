import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { getActionButton, getColumns, getFilterText } from './portfolio-risks-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { TableComponent } from '../../../components/table/table.component';
import { mapRiskReadDTOPageToPortfolioRisksTableRowPage } from '../../../mappers/carlos-risks-mappers';
import { CarlosPortfolioRisksService } from '../../../service/carlos-portfolio-risks.service';
import { RiskCreateModalComponent } from '../../../components/risk-create-modal/risk-create-modal.component';

@Component({
    selector: 'app-portfolio-risks-tab',
    templateUrl: './portfolio-risks-tab.component.html',
    styleUrls: ['./portfolio-risks-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        RiskCreateModalComponent
    ],
    standalone: true
})
export class PortfolioRisksTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private route = inject(ActivatedRoute);
    private risksService = inject(CarlosPortfolioRisksService);
    private routeSubscription?: Subscription;

    filterText = getFilterText();
    columns = getColumns();
    actionButton = getActionButton();

    portfolioId = 0;

    showCreateModal = false;

    router = inject(Router)

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.portfolioId = Number(params.get('id'));
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela de cenários, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.risksService.getPortfolioRisksPage(this.portfolioId, queryParams).pipe(
            map(page => (mapRiskReadDTOPageToPortfolioRisksTableRowPage(page)))
        )
    );
}