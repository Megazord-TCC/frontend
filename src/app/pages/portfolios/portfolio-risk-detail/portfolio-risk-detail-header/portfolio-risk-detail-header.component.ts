import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import { ActionButtons, PageHeaderComponent } from '../../../../components/page-header/page-header.component';
import { PortfolioService } from '../../../../service/portfolio-service';
import { getDateObjectFromDDMMYYYYHHMMSS } from '../../../../helpers/date-helper';
import { CarlosPortfolioRisksService } from '../../../../service/carlos-portfolio-risks.service';
import { RiskEditModalComponent } from '../../../../components/risk-edit-modal/risk-edit-modal.component';
import { RiskDeleteModalComponent } from '../../../../components/risk-delete-modal/risk-delete-modal.component';

@Component({
    selector: 'app-portfolio-risk-detail-header',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        RiskEditModalComponent,
        RiskDeleteModalComponent
    ],
    templateUrl: './portfolio-risk-detail-header.component.html',
    styleUrl: './portfolio-risk-detail-header.component.scss'
})
export class PortfolioRiskDetailHeaderComponent {
    riskId = 0;

    portfolioId = 0;
    portfolioName = '...';

    name = '...';
    description = '...';
    goBackButtonPathToNavigate = '';
    lastUpdate?: Date;
    visibleActionButtons: ActionButtons[] = [];

    routeSubscription?: Subscription;

    route = inject(ActivatedRoute);
    router = inject(Router);
    breadcrumbService = inject(BreadcrumbService);
    portfolioService = inject(PortfolioService);
    riskService = inject(CarlosPortfolioRisksService);

    isEditModalVisible = false;
    isDeleteModalVisible = false;

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.riskId = Number(params.get('riscoId'));
            this.portfolioId = Number(params.get('portfolioId'));
            this.loadRiskAndPortfolioDetails();
        });
    }

    loadRiskAndPortfolioDetails() {
        forkJoin({
            risk: this.riskService.getRiskById(this.portfolioId, this.riskId),
            portfolio: this.portfolioService.getPortfolioById(this.portfolioId)
        }).subscribe(({ risk, portfolio }) => {
            this.name = risk.name;
            this.description = risk.description;
            this.goBackButtonPathToNavigate = `/portfolio/${this.portfolioId}`;
            this.lastUpdate = getDateObjectFromDDMMYYYYHHMMSS(risk.lastModifiedAt);
            this.portfolioName = portfolio.name;
            this.visibleActionButtons = risk.occurrences?.length ? ['edit'] : ['edit', 'delete'];
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
            { label: `Risco: ${this.name}`, url: `/portfolio/${this.portfolioId}/risco/${this.riskId}`, isActive: true },
        ]);
    }
}
