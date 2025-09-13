import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { Subscription } from 'rxjs';
import { ActionButtons, PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { PortfolioService } from '../../../service/portfolio-service';
import { PortfolioDTOStatus, PortfolioReadDTO } from '../../../interface/carlos-portfolio-interfaces';
import { mapPortfolioDTOStatusToBadgeStatusColor, mapPortfolioDTOStatusToText } from '../../../mappers/portfolio-mapper';
import { formatToBRL } from '../../../helpers/money-helper';
import { PortfolioEditModalComponent } from '../../../components/portfolio-edit-modal/portfolio-edit-modal.component';
import { PortfolioCancelModalComponent } from '../../../components/portfolio-cancel-modal/portfolio-cancel-modal.component';
import { PortfolioDeleteModalComponent } from '../../../components/portfolio-delete-modal/portfolio-delete-modal.component';
import { getDateObjectFromDDMMYYYYHHMMSS } from '../../../helpers/date-helper';

@Component({
    selector: 'app-portfolio-detail-header',
    templateUrl: './portfolio-detail-header.component.html',
    styleUrls: ['./portfolio-detail-header.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        PortfolioEditModalComponent,
        PortfolioCancelModalComponent,
        PortfolioDeleteModalComponent
    ],
    standalone: true
})
export class PortfolioDetailHeaderComponent {
    private route = inject(ActivatedRoute);
    private breadcrumbService = inject(BreadcrumbService);
    private portfolioService = inject(PortfolioService);

    portfolioId = 0;
    name = '...';
    description = '...';
    statusBadge = { text: '...', color: 'blue' };
    lastUpdate?: Date;
    budget = '0,00';
    scenarioDTO?: PortfolioReadDTO;
    visibleActionButtons: ActionButtons[] = ['edit'];
    cancellationReason = '';

    portfolioDTO?: PortfolioReadDTO;

    routeSubscription?: Subscription;

    isPortfolioEditModalVisible = false;
    isPortfolioDeleteModalVisible = false;
    isPortfolioCancelModalVisible = false;

    ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.portfolioId = Number(params.get('id'));
            this.loadPortfolioDTO();
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    loadPortfolioDTO() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(dto => {
            this.portfolioDTO = dto;
            this.setPortfolioRelatedVariables();
            this.setupPageByPortfolioStatus();
            this.setupBreadcrumbs();
        });
    }

    setPortfolioRelatedVariables() {
        if (!this.portfolioDTO) return;

        this.name = this.portfolioDTO.name;
        this.description = this.portfolioDTO.description;
        this.statusBadge = {
            text: mapPortfolioDTOStatusToText(this.portfolioDTO.status),
            color: mapPortfolioDTOStatusToBadgeStatusColor(this.portfolioDTO.status)
        };
        this.lastUpdate = this.portfolioDTO.lastModifiedAt ? 
            getDateObjectFromDDMMYYYYHHMMSS(this.portfolioDTO.lastModifiedAt) : 
            getDateObjectFromDDMMYYYYHHMMSS(this.portfolioDTO.createdAt);
        this.budget = formatToBRL(this.portfolioDTO.budget);
        this.cancellationReason = this.portfolioDTO.cancellationReason;
    }

    setupBreadcrumbs() {
        this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Portfólios', url: '/portfolios', isActive: false },
            { label: this.name ?? '...', url: `/portfolio/${this.portfolioId}`, isActive: true },
        ]);
    }

    setupPageByPortfolioStatus() {
        let buttons: ActionButtons[] = ['edit'];

        if (!this.portfolioDTO) {
            this.visibleActionButtons = buttons;
            return;
        }

        if (this.portfolioDTO.status != PortfolioDTOStatus.CANCELADO)
            buttons.push('cancel');

        if (this.portfolioDTO.canBeDeleted)
            buttons.push('delete');

        this.visibleActionButtons = buttons;
    }
}