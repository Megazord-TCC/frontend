import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { TableComponent } from '../../../components/table/table.component';
import { getActionButton, getColumns, getFilterText } from './portfolio-supervisors-tab-table-config';
import { PortfolioSupervisorService } from '../../../service/portfolio-supervisors.service';
import { mapUserGetResponseDTOPageToPortfolioSupervisorTableRowPage } from '../../../mappers/portfolio-supervisor-mappers';
import { PortfolioSupervisorCreateModalComponent } from '../../../components/portfolio-supervisor-create-modal/portfolio-supervisor-create-modal.component';
import { PortfolioSupervisorDeleteModalComponent } from '../../../components/portfolio-supervisor-delete-modal/portfolio-supervisor-delete-modal.component';


@Component({
    selector: 'app-portfolio-supervisors-tab',
    templateUrl: './portfolio-supervisors-tab.component.html',
    styleUrls: ['./portfolio-supervisors-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        PortfolioSupervisorCreateModalComponent,
        PortfolioSupervisorDeleteModalComponent
    ],
    standalone: true
})
export class PortfolioSupervisorsTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private route = inject(ActivatedRoute);
    private portfolioSupervisorService = inject(PortfolioSupervisorService);
    private routeSubscription?: Subscription;

    filterText = getFilterText();
    columns = getColumns();
    actionButton = getActionButton();

    portfolioId = 0;

    selectedSupervisorId = 0;

    isCreateModalVisible = false;
    isDeleteModalVisible = false;

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
        this.portfolioSupervisorService.getPortfolioSupervisorsPage(this.portfolioId, queryParams)
            .pipe(map(page => (mapUserGetResponseDTOPageToPortfolioSupervisorTableRowPage(page))))
    );


}