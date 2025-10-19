import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TableComponent } from '../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { map, Observable } from 'rxjs';
import { PortfolioService } from '../../service/portfolio-service';
import { mapPortfolioDTOPageToPortfolioTableRowPage } from '../../mappers/portfolio-mapper';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './portfolio-table-config';
import { PortfolioTableRow } from '../../interface/carlos-portfolio-interfaces';
import { PortfolioCreateModal } from '../../components/portfolio-create-modal/portfolio-create-modal.component';

@Component({
    selector: 'app-portfolios',
    templateUrl: './portfolios.component.html',
    styleUrls: ['./portfolios.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        TableComponent,
        PortfolioCreateModal
    ],
})
export class PortfoliosComponent implements OnInit {
    @ViewChild(PortfolioCreateModal) createModal?: PortfolioCreateModal;

    private router = inject(Router);
    private breadcrumbService = inject(BreadcrumbService);
    private portfolioService = inject(PortfolioService);

    showCreateModal = false;

    filterButtons = getFilterButtons();
    filterText = getFilterText();
    columns = getColumns();
    actionButton = getActionButton();

    ngOnInit(): void {
        this.setupBreadcrumbs();
    }

    setupBreadcrumbs(): void {
        this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Portfólios', url: '/portfolios', isActive: true }
        ]);

        this.breadcrumbService.removeChildrenAfter('/portfolios');
    }

    openCreateModal(): void {
        this.showCreateModal = true;
        this.createModal?.restartForm();
    }

    openPortfolio(row: PortfolioTableRow) {
        this.router.navigate(['/portfolio', row.id]);
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela de cenários, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.portfolioService.getPortfoliosPage(queryParams).pipe(
            map(page => (mapPortfolioDTOPageToPortfolioTableRowPage(page)))
        )
    );
}
