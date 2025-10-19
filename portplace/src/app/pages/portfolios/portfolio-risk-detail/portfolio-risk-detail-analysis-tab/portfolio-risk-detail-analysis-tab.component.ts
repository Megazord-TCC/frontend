import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventAboutEditModalComponent } from '../../../../components/event-about-edit-modal/event-about-edit-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CarlosPortfolioRisksService } from '../../../../service/carlos-portfolio-risks.service';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { mapRiskScaleEnumDTOToBadgeColor, mapRiskScaleEnumDTOToRiskScale, mapSeverityNumberToBadgeColor } from '../../../../mappers/carlos-risks-mappers';
import { RiskScaleEnumDTO } from '../../../../interface/carlos-risk-interfaces';
import { TooltipComponent } from '../../../../components/tooltip/tooltip.component';
import { RiskAnalysisEditModalComponent } from '../../../../components/risk-analysis-edit-modal/risk-analysis-edit-modal.component';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-risk-detail-analysis-tab',
    imports: [
        CommonModule,
        FormsModule,
        EventAboutEditModalComponent,
        BadgeComponent,
        TooltipComponent,
        RiskAnalysisEditModalComponent
    ],
    templateUrl: './portfolio-risk-detail-analysis-tab.component.html',
    styleUrl: './portfolio-risk-detail-analysis-tab.component.scss'
})
export class PortfolioRiskDetailAnalysisTabComponent {
    severity = 0;
    probability = RiskScaleEnumDTO.LOW;
    impact = RiskScaleEnumDTO.LOW;
    probabilityJustification = '';
    impactJustification = '';
    preventionPlan = '';
    contingencyPlan = '';

    showEditModal = false;

    portfolioId = 0;
    riskId = 0;

    riskService = inject(CarlosPortfolioRisksService);
    route = inject(ActivatedRoute);

    mapSeverityNumberToBadgeColor = mapSeverityNumberToBadgeColor;
    mapRiskScaleEnumDTOToBadgeColor = mapRiskScaleEnumDTOToBadgeColor;
    mapRiskScaleEnumDTOToRiskScale = mapRiskScaleEnumDTOToRiskScale;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.riskId = Number(this.route.snapshot.paramMap.get('riscoId'));
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.riskService.getRiskById(this.portfolioId, this.riskId).subscribe(event => {
            this.probabilityJustification = event.probabilityDescription;
            this.impactJustification = event.impactDescription;
            this.preventionPlan = event.preventionPlan;
            this.contingencyPlan = event.contingencyPlan;
            this.severity = event.severity;
            this.probability = event.probability ?? RiskScaleEnumDTO.LOW;
            this.impact = event.impact ?? RiskScaleEnumDTO.LOW;
        });
    }
}
