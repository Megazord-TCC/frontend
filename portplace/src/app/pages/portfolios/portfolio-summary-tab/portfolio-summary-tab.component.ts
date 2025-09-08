import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../../service/portfolio-service';
import { CardComponent } from '../../../components/card/card.component';
import { MetricCard, MetricCardComponent } from '../../../components/metric-card/metric-card.component';
import { PortfolioMetricCardBuilder } from './portfolio-metric-card-builder';

@Component({
    selector: 'app-portfolio-summary-tab',
    templateUrl: './portfolio-summary-tab.component.html',
    styleUrls: ['./portfolio-summary-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        CardComponent,
        MetricCardComponent
    ],
    standalone: true
})
export class PortfolioSummaryTabComponent {
    private route = inject(ActivatedRoute);
    private portfolioService = inject(PortfolioService);
    private routeSubscription?: Subscription;

    cards: MetricCard[] = [];

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            let portfolioId = Number(params.get('id'));

            this.cards = (await new PortfolioMetricCardBuilder(this.portfolioService)
                .fromGetRequestById(portfolioId))
                .withBudget()
                .withProgressStatus()
                .withCostStatus()
                .withStrategyName()
                .withResponsibleUserNames()
                .build();
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

}