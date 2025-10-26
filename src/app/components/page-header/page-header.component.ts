import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TooltipComponent } from '../tooltip/tooltip.component';

export type ActionButtons = 'edit' | 'cancel' | 'delete' | 'complete';

@Component({
    selector: 'app-page-header',
    imports: [
        SvgIconComponent,
        BadgeComponent,
        CommonModule,
        TooltipComponent
    ],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
    @Input({ required: true }) title: string = '';

    // Inputs não fornecidos não são impressos na tela.
    @Input() goBackButtonPathToNavigate?: string;
    @Input() visibleActionButtons: ActionButtons[] = [];
    @Input() description?: string;
    @Input() lastUpdate?: Date;
    @Input() statusBadge?: { color: string, text: string };
    @Input() cancellationReason = '';

    // Dados extras impressos abaixo da 'description'. Ex: { key: 'Orçamento', value: 'R$ 1.000,00' }
    @Input() extraKeyValuePairInfos: { key: string, value: string, tooltip: string }[] = [];

    @Output() editClick = new EventEmitter<void>();
    @Output() cancelClick = new EventEmitter<void>();
    @Output() deleteClick = new EventEmitter<void>();
    @Output() completeClick = new EventEmitter<void>();

    router = inject(Router);
}
