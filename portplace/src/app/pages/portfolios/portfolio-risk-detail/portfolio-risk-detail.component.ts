import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioRiskDetailHeaderComponent } from './portfolio-risk-detail-header/portfolio-risk-detail-header.component';
import { PortfolioRiskDetailTabButtonsComponent, RiskTabs } from './portfolio-risk-detail-tab-buttons/portfolio-risk-detail-tab-buttons.component';
import { PortfolioRiskDetailAnalysisTabComponent } from './portfolio-risk-detail-analysis-tab/portfolio-risk-detail-analysis-tab.component';
import { PortfolioRiskDetailOccurrencesTabComponent } from './portfolio-risk-detail-occurrences-tab/portfolio-risk-detail-occurrences-tab.component';

@Component({
    selector: 'app-portfolio-risk-detail',
    imports: [
        CommonModule,
        FormsModule,
        PortfolioRiskDetailHeaderComponent,
        PortfolioRiskDetailTabButtonsComponent,
        PortfolioRiskDetailAnalysisTabComponent,
        PortfolioRiskDetailOccurrencesTabComponent
    ],
    templateUrl: './portfolio-risk-detail.component.html',
    styleUrl: './portfolio-risk-detail.component.scss'
})
export class PortfolioRiskDetailComponent {
    @ViewChild(PortfolioRiskDetailTabButtonsComponent) tabButtonsComponent?: PortfolioRiskDetailTabButtonsComponent;
    @ViewChild(PortfolioRiskDetailHeaderComponent) headerComponent?: PortfolioRiskDetailHeaderComponent;

    activeTab: RiskTabs = 'analysis';
}
