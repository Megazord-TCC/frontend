import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioStakeholdersService } from '../../service/portfolio-stakeholders-service';

@Component({
    selector: 'app-stakeholder-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './stakeholder-delete-modal.component.html',
    styleUrl: './stakeholder-delete-modal.component.scss'
})
export class StakeholderDeleteModalComponent {
    @Input({ required: true }) portfolioId = 0;
    @Input({ required: true }) stakeholderId = 0;
    
    @Output() close = new EventEmitter<void>();

    router = inject(Router);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        this.portfolioStakeholdersService
            .deleteStakeholder(this.portfolioId, this.stakeholderId)
            .subscribe({
                next: _ => this.router.navigate([`/portfolio/${this.portfolioId}`]),
                error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            });
    }
}
