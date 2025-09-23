import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { EventParticipantCreateDTO, EventParticipantReadDTO, EventParticipantUpdateDTO } from '../interface/carlos-portfolio-event-participant-interfaces';

@Injectable({
    providedIn: 'root'
})
export class PortfolioEventParticipantService {
    http = inject(HttpClient);

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }

    private getParticipantsUrl(portfolioId: number, eventId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/events/${eventId}/participants`;
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
}
