import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';

@Component({
    selector: 'app-portfolio-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-delete-modal.component.html',
    styleUrl: './portfolio-delete-modal.component.scss'
})
export class PortfolioDeleteModalComponent {
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    router = inject(Router);
    portfolioService = inject(PortfolioService);

    portfolioId = 0;

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    
    ngOnInit() {
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
            .deletePortfolio(this.portfolioId)
            .subscribe({
                next: () => this.router.navigate([`/portfolios`]),
                error: () => {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Este portfólio não pode ser excluído.';
                },
            });
    }

}
