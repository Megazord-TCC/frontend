import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tooltip',
    imports: [CommonModule, FormsModule],
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
    @Input() text = 'Sem descrição.';
    // new input: when true (default) tooltip is shown on top, when false shown on bottom
    @Input() isTextOnTop: boolean = true;
}
