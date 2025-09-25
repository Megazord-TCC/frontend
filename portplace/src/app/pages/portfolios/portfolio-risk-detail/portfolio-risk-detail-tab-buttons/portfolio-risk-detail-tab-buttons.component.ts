import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';
import { CarlosPortfolioRiskOccurrenceService } from '../../../../service/carlos-portfolio-risks-occurrence.service';
import { ActivatedRoute } from '@angular/router';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { getBadgeColorByRiskOccurrenceCount } from '../../../../mappers/carlos-risk-occurrences-mappers';

export type RiskTabs = 'analysis' | 'occurrences';

@Component({
    selector: 'app-portfolio-risk-detail-tab-buttons',
    imports: [
        CommonModule,
        FormsModule,
        SvgIconComponent,
        BadgeComponent
    ],
    templateUrl: './portfolio-risk-detail-tab-buttons.component.html',
    styleUrl: './portfolio-risk-detail-tab-buttons.component.scss'
})
export class PortfolioRiskDetailTabButtonsComponent {
    @Output() change = new EventEmitter<RiskTabs>();
    
    activeTab: RiskTabs = 'analysis';
    riskOccurrenceNotSolvedCount = 0;
    portfolioId = 0;
    riskId = 0;

    getBadgeColor = getBadgeColorByRiskOccurrenceCount;

    route = inject(ActivatedRoute);
    occurrenceService = inject(CarlosPortfolioRiskOccurrenceService);

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.riskId = Number(this.route.snapshot.paramMap.get('riscoId'));
        this.reloadOccurrenceNotSolvedCount();
    }

    reloadOccurrenceNotSolvedCount() {
        this.occurrenceService.getNotSolvedRiskOccurrencesCountByRiskId(this.portfolioId, this.riskId).subscribe(
            count => this.riskOccurrenceNotSolvedCount = count
        );
    }

}
