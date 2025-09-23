import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import { ActionButtons, PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { PortfolioService } from '../../../../service/portfolio-service';
import { PortfolioStakeholdersService } from '../../../../service/portfolio-stakeholders-service';
import { StakeholderEditModalComponent } from '../../../../components/stakeholder-edit-modal/stakeholder-edit-modal.component';
import { StakeholderDeleteModalComponent } from '../../../../components/stakeholder-delete-modal/stakeholder-delete-modal.component';

@Component({
    selector: 'app-portfolio-stakeholder-detail-header',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        StakeholderEditModalComponent,
        StakeholderDeleteModalComponent
    ],
    templateUrl: './portfolio-stakeholder-detail-header.component.html',
    styleUrl: './portfolio-stakeholder-detail-header.component.scss'
})
export class PortfolioStakeholderDetailHeaderComponent {
    stakeholderId = 0;

    portfolioId = 0;
    portfolioName = '...';

    name = '...';
    goBackButtonPathToNavigate = '';
    lastUpdate?: Date;
    visibleActionButtons: ActionButtons[] = ['edit', 'delete'];

    routeSubscription?: Subscription;

    route = inject(ActivatedRoute);
    router = inject(Router);
    breadcrumbService = inject(BreadcrumbService);
    portfolioService = inject(PortfolioService);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);

    isEditModalVisible = false;
    isDeleteModalVisible = false;

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.stakeholderId = Number(params.get('interessadoId'));
            this.portfolioId = Number(params.get('portfolioId'));
            this.loadHeaderDataByHttpRequest();
        });
    }

    loadHeaderDataByHttpRequest() {
        forkJoin({
            stakeholder: this.portfolioStakeholdersService.getStakeholderById(this.portfolioId, this.stakeholderId),
            portfolio: this.portfolioService.getPortfolioById(this.portfolioId)
        }).subscribe(({ stakeholder, portfolio }) => {
            this.name = stakeholder.name;
            this.goBackButtonPathToNavigate = `/portfolio/${this.portfolioId}`;
            this.lastUpdate = new Date(stakeholder.lastModifiedAt);
            this.portfolioName = portfolio.name;
            this.setupBreadcrumbs();
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    setupBreadcrumbs() {
        this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Portfólios', url: '/portfolios', isActive: false },
            { label: `Portfólio: ${this.portfolioName ?? '...'}`, url: `/portfolio/${this.portfolioId}`, isActive: false },
            { label: `Parte interessada: ${this.name ?? '...'}`, url: `/portfolio/${this.portfolioId}/interessado/${this.stakeholderId}`, isActive: true },
        ]);
    }
}
