import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../service/user-service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';
import { PortfolioSupervisorService } from '../../service/portfolio-supervisors.service';

@Component({
    selector: 'app-portfolio-supervisor-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-supervisor-create-modal.component.html',
    styleUrl: './portfolio-supervisor-create-modal.component.scss'
})
export class PortfolioSupervisorCreateModalComponent {
    @Output() supervisorCreate = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    httpClient = inject(HttpClient);
    userService = inject(UserService);
    portfolioSupervisorService = inject(PortfolioSupervisorService);
    portfolioService = inject(PortfolioService);

    inputNameOptions = [{ id: '', name: 'Selecione um responsável' }];
    inputNameSelected = this.inputNameOptions[0].id;

    portfolioId = 0;
    portfolioName = '...';

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.clearForm();
            this.portfolioId = Number(params.get('id'));
            this.loadPortfolioNameByHttpRequest();
            this.loadSupervisorOptionsByHttpRequest();
        });
    }

    loadPortfolioNameByHttpRequest() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => {
            this.portfolioName = portfolio.name;
        });
    }

    loadSupervisorOptionsByHttpRequest() {
        this.portfolioSupervisorService.getAllActivePMOsNotSupervisingThisPortfolio(this.portfolioId).subscribe({
            next: users => {
                this.inputNameOptions = [
                    this.inputNameOptions[0],
                    ...users.map(user => ({ id: user.id.toString(), name: user.name }))
                ];

                if (!users.length) {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Não há PMOs ativos para serem adicionados como responsáveis.';
                }
            },
            error: _ => {
                this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
                this.isSubmitButtonDisabled = true;
            }
        });
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
        let isFormValid = await this.isFormValid();
        if (!isFormValid) return;

        this.portfolioSupervisorService.addNewPortfolioSupervisor(this.portfolioId, Number(this.inputNameSelected)).subscribe({
            next: _ => this.supervisorCreate.emit(),
            error: _ => this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        });
    }

    clearForm() {
        this.inputNameOptions = [this.inputNameOptions[0]];
        this.inputNameSelected = this.inputNameOptions[0].id;
        this.errorMessage = '';
        this.isSubmitButtonDisabled = false;
    }

    async isFormValid(): Promise<boolean> {
        return this.isNameSelected();
    }

    isNameSelected(): boolean {
        let isNameSelected = !!this.inputNameSelected;

        this.errorMessage = isNameSelected ? '' : 'Os campos marcados com * são obrigatórios.';

        return isNameSelected;
    }
}
