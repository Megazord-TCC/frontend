import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription, tap } from 'rxjs';
import { CardComponent } from '../../../components/card/card.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { TableComponent } from '../../../components/table/table.component';
import { getColumns, getFilterButtons, getFilterText } from './portfolio-projects-tab-table-config';
import { PortfolioService } from '../../../service/portfolio-service';
import { mapProjectReadDTO2PageToPortfolioProjectTableRowPage } from '../../../mappers/portfolio-mapper';
import { ScenarioService } from '../../../service/scenario-service';

@Component({
    selector: 'app-portfolio-projects-tab',
    templateUrl: './portfolio-projects-tab.component.html',
    styleUrls: ['./portfolio-projects-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        CardComponent,
        TableComponent,
    ],
    standalone: true
})
export class PortfolioProjectsTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private portfolioService = inject(PortfolioService);
    private routeSubscription?: Subscription;

    filterButtons = getFilterButtons();
    filterText = getFilterText();
    columns = getColumns();

    portfolioId = 0;

    doesNotHaveProjects = false;

    scenarioName = 'Erro';

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
        this.portfolioService.getProjectsPageByPortfolioId(this.portfolioId, queryParams)
            .pipe(
                map(page => (mapProjectReadDTO2PageToPortfolioProjectTableRowPage(page))),
                tap(page => { 
                    // Esse if evita mostrar texto "O portfólio não possui projetos" quando é aplicado
                    // um filtro sem resultado
                    if (!queryParams?.isAnyFilterApplied()) {
                        this.doesNotHaveProjects = page.totalElements == 0;
                    }
                })
            )
    );

    navigateToProjectDetailPage(projectId: number) {
        this.router.navigate([`/projeto/${projectId}`]);
    }
}