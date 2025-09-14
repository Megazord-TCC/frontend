import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from '../../service/scenario-service';

@Component({
    selector: 'app-warning-information-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './warning-information-modal.component.html',
    styleUrl: './warning-information-modal.component.scss'
})
export class WarningInformationModalComponent {
    @Input() text = 'Nenhum aviso foi definido.';
    @Input() closeButtonLabel = 'Entendi';

    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    strategyId = 0;
    scenarioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) {
            this.onClose();
        }
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.mouseDownOnOverlay = true;
        }
    }

    onClose(): void {
        this.close.emit();
    }

}
