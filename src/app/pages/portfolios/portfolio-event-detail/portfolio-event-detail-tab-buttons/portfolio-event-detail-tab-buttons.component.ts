import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';

type EventTabs = 'about' | 'participants';

@Component({
    selector: 'app-portfolio-event-detail-tab-buttons',
    imports: [
        CommonModule,
        FormsModule,
        SvgIconComponent
    ],
    templateUrl: './portfolio-event-detail-tab-buttons.component.html',
    styleUrl: './portfolio-event-detail-tab-buttons.component.scss'
})
export class PortfolioEventDetailTabButtonsComponent {
    activeTab: EventTabs = 'about';

    @Output() change = new EventEmitter<EventTabs>();
}
