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
import { PortfolioEventsService } from '../../../../service/portfolio-events-service';
import { EventEditModal } from '../../../../components/event-edit-modal/event-edit-modal.component';
import { EventDeleteModalComponent } from '../../../../components/event-delete-modal/event-delete-modal.component';

@Component({
    selector: 'app-portfolio-event-detail-header',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        EventEditModal,
        EventDeleteModalComponent
    ],
    templateUrl: './portfolio-event-detail-header.component.html',
    styleUrl: './portfolio-event-detail-header.component.scss'
})
export class PortfolioEventDetailHeaderComponent {
    eventId = 0;

    portfolioId = 0;
    portfolioName = '...';

    name = '...';
    description = '...';
    goBackButtonPathToNavigate = '';
    lastUpdate?: Date;
    visibleActionButtons: ActionButtons[] = ['edit', 'delete'];

    routeSubscription?: Subscription;

    route = inject(ActivatedRoute);
    router = inject(Router);
    breadcrumbService = inject(BreadcrumbService);
    portfolioService = inject(PortfolioService);
    eventService = inject(PortfolioEventsService);

    isEditModalVisible = false;
    isDeleteModalVisible = false;

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.eventId = Number(params.get('eventoId'));
            this.portfolioId = Number(params.get('portfolioId'));
            this.loadEventAndPortfolioDetails();
        });
    }

    loadEventAndPortfolioDetails() {
        forkJoin({
            event: this.eventService.getPortfolioEventById(this.portfolioId, this.eventId),
            portfolio: this.portfolioService.getPortfolioById(this.portfolioId)
        }).subscribe(({ event, portfolio }) => {
            this.name = event.name;
            this.description = event.description;
            this.goBackButtonPathToNavigate = `/portfolio/${this.portfolioId}`;
            this.lastUpdate = getDateObjectFromDDMMYYYYHHMMSS(event.lastModifiedAt);
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
            { label: `Evento: ${this.name}`, url: `/portfolio/${this.portfolioId}/evento/${this.eventId}`, isActive: true },
        ]);
    }
}
