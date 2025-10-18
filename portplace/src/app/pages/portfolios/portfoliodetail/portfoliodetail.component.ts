import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { PortfolioDetailHeaderComponent } from '../portfolio-detail-header/portfolio-detail-header.component';
import { PortfolioSummaryTabComponent } from '../portfolio-summary-tab/portfolio-summary-tab.component';
import { PortfolioCategoryTabComponent } from '../portfolio-category-tab/portfolio-category-tab.component';
import { PortfolioProjectsTabComponent } from '../portfolio-projects-tab/portfolio-projects-tab.component';
import { PortfolioSupervisorsTabComponent } from '../portfolio-supervisors-tab/portfolio-supervisors-tab.component';
import { PortfolioCommunicationTabComponent } from '../portfolio-communication-tab/portfolio-communication-tab.component';
import { PortfolioRisksTabComponent } from '../portfolio-risks-tab/portfolio-risks-tab.component';
import { CarlosPortfolioRiskOccurrenceService } from '../../../service/carlos-portfolio-risks-occurrence.service';
import { ActivatedRoute } from '@angular/router';
import { getBadgeColorByRiskOccurrenceCount } from '../../../mappers/carlos-risk-occurrences-mappers';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfoliodetail.component.html',
  styleUrls: ['./portfoliodetail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    SvgIconComponent,
    PortfolioDetailHeaderComponent,
    PortfolioSummaryTabComponent,
    PortfolioCategoryTabComponent,
    PortfolioProjectsTabComponent,
    PortfolioSupervisorsTabComponent,
    PortfolioCommunicationTabComponent,
    PortfolioRisksTabComponent
  ],
  standalone: true
})
export class PortfolioDetailComponent {
    activeTab: 'resumo' | 'projetos' | 'riscos' | 'comunicacao' | 'responsaveis' | 'categorias' = 'resumo';
    riskOccurrenceNotSolvedCount = 0;
    portfolioId = 0;

    occurrenceService = inject(CarlosPortfolioRiskOccurrenceService);
    route = inject(ActivatedRoute);

    getBadgeColor = getBadgeColorByRiskOccurrenceCount;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadRiskOccurrenceNotSolvedCount();
    }

    loadRiskOccurrenceNotSolvedCount() {
        this.occurrenceService.getNotSolvedRiskOccurrencesCountByPortfolioId(this.portfolioId)
            .subscribe(count => this.riskOccurrenceNotSolvedCount = count);
    }
}
