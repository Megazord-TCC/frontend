import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PortfolioLevelScale, StakeholderReadDTO } from '../../../../interface/carlos-portfolio-stakeholders-interfaces';
import { PortfolioStakeholdersService } from '../../../../service/portfolio-stakeholders-service';
import { mapPortfolioLevelScaleToBadgeColor, mapPortfolioScaleEnumDTOToPortfolioLevelScale } from '../../../../mappers/portfolio-stakeholder-mappers';
import { StakeholderAboutEditModalComponent } from '../../../../components/stakeholder-about-edit-modal/stakeholder-about-edit-modal.component';
import { BadgeComponent } from '../../../../components/badge/badge.component';

export type EventTab = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-event-detail-about-tab',
    imports: [
        CommonModule,
        FormsModule,
        StakeholderAboutEditModalComponent,
        BadgeComponent
    ],
    templateUrl: './portfolio-event-detail-about-tab.component.html',
    styleUrl: './portfolio-event-detail-about-tab.component.scss'
})
export class PortfolioEventDetailAboutTabComponent {
    powerLevel?: PortfolioLevelScale;
    powerLevelJustification = '';
    interestLevel?: PortfolioLevelScale;
    interestLevelJustification = '';
    expectations = '';
    supervisorsObligationWithStakeholder = '';
    positivePoints = '';
    negativePoints = '';

    showEditModal = false;

    portfolioId = 0;
    stakeholderId = 0;

    portfolioStakeholdersService = inject(PortfolioStakeholdersService);
    route = inject(ActivatedRoute);

    mapToBadgeColor = mapPortfolioLevelScaleToBadgeColor;

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.stakeholderId = Number(this.route.snapshot.paramMap.get('interessadoId'));
        this.fillFormDataByHttpRequest();
    }

    fillFormDataByHttpRequest() {
        this.portfolioStakeholdersService.getStakeholderById(this.portfolioId, this.stakeholderId).subscribe((stakeholder: StakeholderReadDTO) => {
            this.powerLevel = mapPortfolioScaleEnumDTOToPortfolioLevelScale(stakeholder.powerLevel);
            this.powerLevelJustification = stakeholder.powerLevelJustification;
            this.interestLevel = mapPortfolioScaleEnumDTOToPortfolioLevelScale(stakeholder.interestLevel);
            this.interestLevelJustification = stakeholder.interestLevelJustification;
            this.expectations = stakeholder.expectations;
            this.supervisorsObligationWithStakeholder = stakeholder.obligationsWithStakeholder;
            this.positivePoints = stakeholder.positivePoints;
            this.negativePoints = stakeholder.negativePoints;
        });
    }
}
