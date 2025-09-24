import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';

export type StakeholderTabs = 'about' | 'events';

@Component({
    selector: 'app-portfolio-stakeholder-detail-tab-buttons',
    imports: [
        CommonModule,
        FormsModule,
        SvgIconComponent
    ],
    templateUrl: './portfolio-stakeholder-detail-tab-buttons.component.html',
    styleUrl: './portfolio-stakeholder-detail-tab-buttons.component.scss'
})
export class PortfolioStakeholderDetailTabButtonsComponent {
    activeTab: StakeholderTabs = 'about';

    @Output() change = new EventEmitter<StakeholderTabs>();
}
