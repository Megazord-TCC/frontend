import { Component, Input } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { CommonModule } from '@angular/common';

export class MetricCard {
    iconPath = '';
    title = '';
    color = 'none';
    subtitle = '';
}

@Component({
    selector: 'app-metric-card',
    imports: [
        SvgIconComponent,
        CommonModule,
    ],
    templateUrl: './metric-card.component.html',
    styleUrls: ['./metric-card.component.scss']
})
export class MetricCardComponent {
    @Input({ required: true }) card = new MetricCard();
}
