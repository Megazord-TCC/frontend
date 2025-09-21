import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { TableComponent } from '../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { map, Observable } from 'rxjs';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './users-table-config';
import { PortfolioTableRow } from '../../interface/carlos-portfolio-interfaces';
import { PortfolioCreateModal } from '../../components/portfolio-create-modal/portfolio-create-modal.component';
import { mapUserGetResponseDTOPageToUserTableRowPage } from '../../mappers/users-mappers';
import { UserService } from '../../service/user-service';
import { UserCreateModalComponent } from '../../components/user-create-modal/user-create-modal.component';
import { UserEditModalComponent } from '../../components/user-edit-modal/user-edit-modal.component';

@Component({
    selector: 'app-users-page',
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        TableComponent,
        UserCreateModalComponent,
        UserEditModalComponent
    ],
})
export class UsersPageComponent implements OnInit {
    @ViewChild(PortfolioCreateModal) createModal?: PortfolioCreateModal;
    @ViewChild(TableComponent) tableComponent?: TableComponent;

    private router = inject(Router);
    private breadcrumbService = inject(BreadcrumbService);
    private userService = inject(UserService);

    showCreateModal = false;
    showEditModal = false;

    userEditId = 0;

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
            { label: 'Usuários', url: '/usuarios', isActive: true }
        ]);

        this.breadcrumbService.removeChildrenAfter('/usuarios');
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
        this.userService.getUsersPage(queryParams).pipe(map(page => (mapUserGetResponseDTOPageToUserTableRowPage(page))))
    );

    
}
