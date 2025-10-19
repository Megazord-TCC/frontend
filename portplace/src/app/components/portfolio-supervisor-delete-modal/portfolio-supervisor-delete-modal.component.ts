import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../service/user-service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';
import { PortfolioSupervisorService } from '../../service/portfolio-supervisors.service';

@Component({
    selector: 'app-portfolio-supervisor-delete-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-supervisor-delete-modal.component.html',
    styleUrl: './portfolio-supervisor-delete-modal.component.scss'
})
export class PortfolioSupervisorDeleteModalComponent {
    @Input({ required: true }) supervisorId = 0;

    @Output() supervisorDelete = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    httpClient = inject(HttpClient);
    userService = inject(UserService);
    portfolioSupervisorService = inject(PortfolioSupervisorService);
    portfolioService = inject(PortfolioService);

    supervisorUserName = '...';

    portfolioId = 0;
    portfolioName = '...';

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.portfolioId = Number(params.get('id'));
            this.loadPortfolioNameByHttpRequest();
            this.loadSupervisorNameByHttpRequest();
        });
    }

    loadPortfolioNameByHttpRequest() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => this.portfolioName = portfolio.name);
    }

    loadSupervisorNameByHttpRequest() {
        this.userService.getUserById(this.supervisorId).subscribe(user => this.supervisorUserName = user.name);
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();
        this.mouseDownOnOverlay = false;
    }

    onOverlayMouseDown(event: MouseEvent): void {
        if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
    }

    async onSave(): Promise<any> {
        this.portfolioSupervisorService.removePortfolioSupervisor(this.portfolioId, Number(this.supervisorId)).subscribe({
            next: _ => this.supervisorDelete.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }
}
