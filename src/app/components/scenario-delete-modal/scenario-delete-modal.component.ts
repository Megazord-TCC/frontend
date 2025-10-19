import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenarioService } from '../../service/scenario-service';

@Component({
    selector: 'app-scenario-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './scenario-delete-modal.component.html',
    styleUrl: './scenario-delete-modal.component.scss'
})
export class ScenarioDeleteModal {
    @Input() isVisible = false;

    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    strategyId = 0;
    scenarioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    
    ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.scenarioId = Number(this.route.snapshot.paramMap.get('cenarioId'));
    }

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

    async onSave(): Promise<any> {
        this.scenarioService
            .deleteScenario(this.strategyId, this.scenarioId)
            .subscribe({
                next: () => this.router.navigate([`/estrategia/${this.strategyId}`]),
                error: () => { 
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Este cenário já foi vinculado a um portfólio, não é permitido excluí-lo.' 
                },
            });
    }

}
