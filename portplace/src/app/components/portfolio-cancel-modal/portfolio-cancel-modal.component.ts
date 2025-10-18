import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-portfolio-cancel-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-cancel-modal.component.html',
    styleUrl: './portfolio-cancel-modal.component.scss'
})
export class PortfolioCancelModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() portfolioCancelled = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);

    portfolioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    inputCancellationReason = '';

    async ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('id'));
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
        this.portfolioService
            .cancelPortfolio(this.portfolioId, this.inputCancellationReason)
            .subscribe({
                next: _ => this.portfolioCancelled.emit(),
                error: _ => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.'
                },
            });
    }
}
