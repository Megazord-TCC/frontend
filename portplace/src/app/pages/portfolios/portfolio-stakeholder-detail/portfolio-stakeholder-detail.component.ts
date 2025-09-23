import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioStakeholderDetailTabButtonsComponent, StakeholderTabs } from './portfolio-stakeholder-detail-tab-buttons/portfolio-stakeholder-detail-tab-buttons.component';
import { PortfolioStakeholderDetailHeaderComponent } from './portfolio-stakeholder-detail-header/portfolio-stakeholder-detail-header.component';
import { PortfolioEventDetailAboutTabComponent } from './portfolio-event-detail-about-tab/portfolio-event-detail-about-tab.component';

@Component({
    selector: 'app-portfolio-stakeholder-detail',
    imports: [
        CommonModule,
        FormsModule,
        PortfolioStakeholderDetailTabButtonsComponent,
        PortfolioStakeholderDetailHeaderComponent,
        PortfolioEventDetailAboutTabComponent
    ],
    templateUrl: './portfolio-stakeholder-detail.component.html',
    styleUrl: './portfolio-stakeholder-detail.component.scss'
})
export class PortfolioStakeholderDetailComponent {
    activeTab: StakeholderTabs = 'about';
}
