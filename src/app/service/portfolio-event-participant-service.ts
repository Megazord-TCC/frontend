import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { EventParticipantCreateDTO, EventParticipantReadDTO, EventParticipantUpdateDTO } from '../interface/carlos-portfolio-event-participant-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioEventParticipantService {
    http = inject(HttpClient);

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }
    private getParticipantsUrl(portfolioId: number, eventId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/events/${eventId}/participants`;
    }

    // GET - Busca participante por id
    getParticipantById(portfolioId: number, eventId: number, participantId: number): Observable<EventParticipantReadDTO> {
        const url = `${this.getParticipantsUrl(portfolioId, eventId)}/${participantId}`;
        return this.http.get<EventParticipantReadDTO>(url, { headers: this.getHeaders() });
    }

    // GET - Busca a página de participantes
    getParticipantsPage(portfolioId: number, eventId: number, queryParams?: PaginationQueryParams): Observable<Page<EventParticipantReadDTO>> {
        const url = this.getParticipantsUrl(portfolioId, eventId);
        const params = queryParams?.getParamsInHttpParamsFormat();
        return this.http.get<Page<EventParticipantReadDTO>>(url, { headers: this.getHeaders(), params });
    }

    // POST - Adiciona um participante ao evento
    addParticipantToEvent(portfolioId: number, eventId: number, stakeholderId: number, isResponsible: boolean): Observable<EventParticipantReadDTO> {
        const url = this.getParticipantsUrl(portfolioId, eventId);
        const body: EventParticipantCreateDTO = { stakeholderId: stakeholderId, eventId: eventId, responsible: isResponsible };
        return this.http.post<EventParticipantReadDTO>(url, body, { headers: this.getHeaders() });
    }

    // UPDATE - Atualiza a responsabilidade dum participante
    updateParticipantResponsibility(portfolioId: number, eventId: number, participantId: number, isResponsible: boolean): Observable<EventParticipantReadDTO> {
        const url = `${this.getParticipantsUrl(portfolioId, eventId)}/${participantId}`;

        return this.getParticipantById(portfolioId, eventId, participantId).pipe(switchMap((participant => {
            const body: EventParticipantUpdateDTO = { stakeholderId: participant.stakeholder?.id || 0, responsible: isResponsible };
            return this.http.put<EventParticipantReadDTO>(url, body, { headers: this.getHeaders() });
        })));
    }

    // DELETE - Remove participante do evento
    removeParticipantFromEvent(portfolioId: number, eventId: number, participantId: number): Observable<void> {
        const url = `${this.getParticipantsUrl(portfolioId, eventId)}/${participantId}/hard-delete`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }
}
