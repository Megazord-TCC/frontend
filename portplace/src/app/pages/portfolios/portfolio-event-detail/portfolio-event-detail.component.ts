import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioEventDetailHeaderComponent } from './portfolio-event-detail-header/portfolio-event-detail-header.component';
import { PortfolioEventDetailTabButtonsComponent } from './portfolio-event-detail-tab-buttons/portfolio-event-detail-tab-buttons.component';
import { EventTab, PortfolioEventDetailAboutTabComponent } from './portfolio-event-detail-about-tab/portfolio-event-detail-about-tab.component';

@Component({
    selector: 'app-portfolio-event-detail',
    imports: [
        CommonModule,
        FormsModule,
        PortfolioEventDetailHeaderComponent,
        PortfolioEventDetailTabButtonsComponent,
        PortfolioEventDetailAboutTabComponent
    ],
    templateUrl: './portfolio-event-detail.component.html',
    styleUrl: './portfolio-event-detail.component.scss'
})
export class PortfolioEventDetailComponent {
    activeTab: EventTab = 'about';
}
