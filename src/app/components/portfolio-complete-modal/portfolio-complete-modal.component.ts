import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-portfolio-complete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-complete-modal.component.html',
    styleUrl: './portfolio-complete-modal.component.scss'
})
export class PortfolioCompleteModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() portfolioComplete = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);

    portfolioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

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
            .completePortfolio(this.portfolioId)
            .subscribe({
                next: _ => this.portfolioComplete.emit(),
                error: _ => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.'
                },
            });
    }
}
