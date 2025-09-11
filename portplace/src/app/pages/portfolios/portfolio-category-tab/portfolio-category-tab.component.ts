import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { CardComponent } from '../../../components/card/card.component';
import { getActionButton, getColumns, getFilterText } from './portfolio-category-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { CategoryService } from '../../../service/category-service';
import { mapPortfolioCategoryReadDTOPageToPortfolioCategoryTableRowPage } from '../../../mappers/category-mapper';
import { TableComponent } from '../../../components/table/table.component';
import { CategoryCreateModal } from '../../../components/category-create-modal/category-create-modal.component';
import { CategoryEditDeleteModalComponent } from '../../../components/category-edit-delete-modal/category-edit-delete-modal.component';

@Component({
    selector: 'app-portfolio-category-tab',
    templateUrl: './portfolio-category-tab.component.html',
    styleUrls: ['./portfolio-category-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        CardComponent,
        TableComponent,
        CategoryCreateModal,
        CategoryEditDeleteModalComponent
    ],
    standalone: true
})
export class PortfolioCategoryTabComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private route = inject(ActivatedRoute);
    private categoryService = inject(CategoryService);
    private routeSubscription?: Subscription;

    filterText = getFilterText();
    columns = getColumns();
    actionButton = getActionButton();

    portfolioId = 0;
    selectedCategoryId = 0;

    showCreateModal = false;

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
        this.categoryService.getPortfolioCategoriesPage(this.portfolioId, queryParams).pipe(
            map(page => (mapPortfolioCategoryReadDTOPageToPortfolioCategoryTableRowPage(page)))
        )
    );
}