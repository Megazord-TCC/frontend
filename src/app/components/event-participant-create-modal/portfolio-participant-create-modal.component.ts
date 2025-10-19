import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../service/user-service';
import { forkJoin, map, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PortfolioEventsService } from '../../service/portfolio-events-service';
import { PortfolioEventParticipantService } from '../../service/portfolio-event-participant-service';
import { PortfolioStakeholdersService } from '../../service/portfolio-stakeholders-service';
import { PaginationQueryParams } from '../../models/pagination-models';
import { StakeholderReadDTO } from '../../interface/carlos-portfolio-stakeholders-interfaces';
import { EventParticipantReadDTO } from '../../interface/carlos-portfolio-event-participant-interfaces';
import { subtractArraysById } from '../../helpers/array-helper';

type Option = { id: string, name: string };

@Component({
    selector: 'app-portfolio-participant-create-modal',
    imports: [CommonModule, FormsModule],
    templateUrl: './portfolio-participant-create-modal.component.html',
    styleUrl: './portfolio-participant-create-modal.component.scss'
})
export class PortfolioParticipantCreateModalComponent {
    @Output() create = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    route = inject(ActivatedRoute);
    httpClient = inject(HttpClient);
    userService = inject(UserService);
    portfolioEventParticipantService = inject(PortfolioEventParticipantService);
    portfolioStakeholdersService = inject(PortfolioStakeholdersService);
    portfolioEventService = inject(PortfolioEventsService);

    inputNameOptions: Option[] = [{ id: '', name: 'Selecione um participante' }];
    inputNameSelected = this.inputNameOptions[0].id;

    inputIsResponsible = false;

    portfolioId = 0;
    eventId = 0;
    eventName = '...';

    errorMessage = '';

    isSubmitButtonDisabled = false;
    mouseDownOnOverlay = false;
    routeSubscription?: Subscription;

    async ngOnInit() {
        this.routeSubscription = this.route.paramMap.subscribe(async params => {
            this.clearForm();
            this.portfolioId = Number(params.get('portfolioId'));
            this.eventId = Number(params.get('eventoId'));
            this.loadEventNameByHttpRequest();
            this.loadParticipantNameOptionsByHttpRequest();
        });
    }

    loadEventNameByHttpRequest() {
        this.portfolioEventService.getPortfolioEventById(this.portfolioId, this.eventId).subscribe(event => {
            this.eventName = event.name;
        });
    }

    loadParticipantNameOptionsByHttpRequest() {
        let params = new PaginationQueryParams();
        params.size = 100000;

        forkJoin([
            this.portfolioEventParticipantService.getParticipantsPage(this.portfolioId, this.eventId, params),
            this.portfolioStakeholdersService.getStakeholdersPage(this.portfolioId, params)
        ]).pipe(
            map(([participantsPage, stakeholdersPage]): [EventParticipantReadDTO[], StakeholderReadDTO[]] =>
                ([participantsPage.content, stakeholdersPage.content])),
            map(([participants, stakeholders]) => ([
                participants.map(p => ({ id: p.stakeholder?.id.toString() ?? '', name: p.stakeholder?.name ?? '' })),
                stakeholders.map(s => ({ id: s.id.toString(), name: s.name }))
            ])),
            map(([participantOptions, stakeholderOptions]): [number, Option[]] => ([
                stakeholderOptions.length,
                subtractArraysById(stakeholderOptions, participantOptions)
            ]))
        ).subscribe({
            next: ([numberOfStakeholdersInPortfolio, stakeholdersOptionsAvailable]) => {
                if (!numberOfStakeholdersInPortfolio) {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Não há interessados para seleção. Realize o cadastro na página deste portfólio, clicando na aba "Comunicação", então "Partes interessadas".';
                    return;
                }

                if (!stakeholdersOptionsAvailable.length) {
                    this.isSubmitButtonDisabled = true;
                    this.errorMessage = 'Todas partes interessadas deste portfólio já foram vinculadas a este evento.';
                    return;
                }

                this.inputNameOptions = [this.inputNameOptions[0], ...stakeholdersOptionsAvailable];
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

        this.portfolioEventParticipantService.addParticipantToEvent(
            this.portfolioId,  
            this.eventId,
            Number(this.inputNameSelected),
            this.inputIsResponsible
        ).subscribe({
            next: _ => this.create.emit(),
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
