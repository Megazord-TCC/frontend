import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { CommunicationMethodDTO, EventCreateDTO, EventPeriodicity, EventPeriodicityDTO, EventReadDTO, EventUpdateDTO } from '../interface/carlos-portfolio-events-interfaces';
import { mapEventPeriodicityToEventPeriodicityDTO } from '../mappers/portfolio-events-mappers';

@Injectable({
    providedIn: 'root'
})
export class PortfolioEventsService {
    http = inject(HttpClient);

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    }

    private getPortfolioEventsUrl(portfolioId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/events`;
    }

    deleteEvent(portfolioId: number, eventId: number): Observable<void> {
        const url = `${this.getPortfolioEventsUrl(portfolioId)}/${eventId}`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }

    // UPDATE - Editar os dados básicos (nome, descrição) de um evento de comunicação do portfólio
    updateEventBasicInformation(portfolioId: number, eventId: number, eventName: string, eventDescription: string): Observable<any> {
        const url = `${this.getPortfolioEventsUrl(portfolioId)}/${eventId}`;
        const body: EventCreateDTO = { name: eventName, description: eventDescription, portfolioId: portfolioId };
        
        return of(undefined); // TODO: Ajustar quando o gabriel adicionar edição de dados básicos do evento. 
        // return this.http.put<any>(url, body, { headers: this.getHeaders() });
    }

    // UPDATE - Editar os dados sobre o evento do portfólio (método comunicação, periodicidade, tópicos, etc)
    updateEventAboutInformation(
        portfolioId: number, 
        eventId: number, 
        requiredDocumentsAndGeneralInfo: string,
        discussionTopic: string,
        eventReason: string,
        periodicitySelected: EventPeriodicity,
        usesCommunicationMethodEmail: boolean,
        usesCommunicationMethodOnlineMeeting: boolean,
        usesCommunicationMethodOnSiteMeeting: boolean,
    ): Observable<any> {
        const url = `${this.getPortfolioEventsUrl(portfolioId)}/${eventId}`;

        let communicationMethods: CommunicationMethodDTO[] = [];
        if (usesCommunicationMethodEmail) communicationMethods.push(CommunicationMethodDTO.EMAIL);
        if (usesCommunicationMethodOnlineMeeting) communicationMethods.push(CommunicationMethodDTO.ONLINE_MEETING);
        if (usesCommunicationMethodOnSiteMeeting) communicationMethods.push(CommunicationMethodDTO.ON_SITE_MEETING);

        const body: EventUpdateDTO = { 
            infosAndDocs: requiredDocumentsAndGeneralInfo,
            discussionTopic: discussionTopic,
            reason: eventReason,
            periodicity: mapEventPeriodicityToEventPeriodicityDTO(periodicitySelected),
            communicationMethods: communicationMethods
         };

        return this.http.put<any>(url, body, { headers: this.getHeaders() });
    }

    getPortfolioEventById(portfolioId: number, eventId: number): Observable<EventReadDTO> {
        const url = `${this.getPortfolioEventsUrl(portfolioId)}/${eventId}`;
        return this.http.get<EventReadDTO>(url, { headers: this.getHeaders() });
    }

    // GET - Buscar os eventos de comunicação do portfólio
    getPortfolioEventsPage(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<EventReadDTO>> {
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams).getParamsInHttpParamsFormat();

        return this.http.get<Page<EventReadDTO>>(this.getPortfolioEventsUrl(portfolioId), { headers: this.getHeaders(), params });
    }

    // GET - Conferir se o nome do evento já existe. O nome tem que ser exatamente igual e por completo.
    getEventByExactName(portfolioId: number, eventName: string): Observable<EventReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.size = 100000;
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: eventName };

        return this.getPortfolioEventsPage(portfolioId, queryParams).pipe(
            map(page => page.content as EventReadDTO[]),
            map(events => {
                let eventWithExactName = events.find(event => event.name == eventName);
                return !!eventWithExactName ? eventWithExactName : undefined;
            })
        );
    }

    // POST - Criar um novo evento de comunicação no portfólio
    createEvent(portfolioId: number, eventName: string, eventDescription: string): Observable<EventReadDTO> {
        const url = this.getPortfolioEventsUrl(portfolioId);
        const body: EventCreateDTO = { name: eventName, description: eventDescription, portfolioId: portfolioId };
        return this.http.post<EventReadDTO>(url, body, { headers: this.getHeaders() });
    }
}
