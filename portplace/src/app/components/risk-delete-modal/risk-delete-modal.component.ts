import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';

@Component({
    selector: 'app-risk-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './risk-delete-modal.component.html',
    styleUrl: './risk-delete-modal.component.scss'
})
export class RiskDeleteModalComponent {
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    riskService = inject(CarlosPortfolioRisksService);

    portfolioId = 0;
    riskId = 0;

    errorMessage = '';
    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    
    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('portfolioId'));
        this.riskId = Number(this.route.snapshot.paramMap.get('riscoId'));
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay)  this.close.emit();
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        this.riskService
            .deleteRisk(this.portfolioId, this.riskId)
            .subscribe({
                next: () => this.router.navigate([`/portfolio/${this.portfolioId}`]),
                error: () => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Este cenário já foi vinculado a um portfólio, não é permitido excluí-lo.' 
                },
            });
    }

}
