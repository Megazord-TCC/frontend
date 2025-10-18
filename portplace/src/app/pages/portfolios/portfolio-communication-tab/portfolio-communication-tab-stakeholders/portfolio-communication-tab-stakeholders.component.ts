import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { getActionButton, getColumns, getFilterText } from './portfolio-communication-tab-stakeholders-table-config';
import { TableComponent } from '../../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { PortfolioStakeholdersService } from '../../../../service/portfolio-stakeholders-service';
import { mapStakeholderReadDTOPageToPortfolioStakeholderTableRowPage } from '../../../../mappers/portfolio-stakeholder-mappers';
import { StakeholderCreateModal } from '../../../../components/stakeholder-create-modal/stakeholder-create-modal.component';

@Component({
    selector: 'app-portfolio-communication-tab-stakeholders',
    templateUrl: './portfolio-communication-tab-stakeholders.component.html',
    styleUrls: ['./portfolio-communication-tab-stakeholders.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TableComponent,
        StakeholderCreateModal
    ],
    standalone: true
})
export class PortfolioCommunicationTabStakeholdersComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private portfolioStakeholdersService = inject(PortfolioStakeholdersService);
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
        this.portfolioStakeholdersService.getStakeholdersPage(this.portfolioId, queryParams)
            .pipe(map(page => (mapStakeholderReadDTOPageToPortfolioStakeholderTableRowPage(page))))
    );

    navigateToStakeholderDetailPage(stakeholderId: number) {
        this.router.navigate([`/portfolio/${this.portfolioId}/interessado/${stakeholderId}`]);
    }
}