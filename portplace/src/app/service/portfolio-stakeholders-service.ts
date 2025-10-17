import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioScaleEnumDTO, StakeholderCreateDTO, StakeholderReadDTO, StakeholderUpdateDTO } from '../interface/carlos-portfolio-stakeholders-interfaces';
import { EventReadDTO } from '../interface/carlos-portfolio-events-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioStakeholdersService {
    http = inject(HttpClient);

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getPortfolioStakeholdersUrl(portfolioId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/stakeholders`;
    }

    // GET - Pega um stakeholder específico de um portfólio
    getStakeholderById(portfolioId: number, stakeholderId: number): Observable<StakeholderReadDTO> {
        const url = `${this.getPortfolioStakeholdersUrl(portfolioId)}/${stakeholderId}`;
        return this.http.get<StakeholderReadDTO>(url, { headers: this.getHeaders() });
    }

    // GET - Pega uma página de stakeholders de um portfólio
    getStakeholdersPage(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<StakeholderReadDTO>> {
        const url = this.getPortfolioStakeholdersUrl(portfolioId);
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams).getParamsInHttpParamsFormat();
        return this.http.get<Page<StakeholderReadDTO>>(url, { headers: this.getHeaders(), params });
    }

    // GET - Conferir se o nome do stakeholder já existe no portfólio. O nome tem que ser exatamente igual e por completo.
    getStakeholderByExactName(portfolioId: number, stakeholderName: string): Observable<StakeholderReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.size = 100000;
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: stakeholderName };

        return this.getStakeholdersPage(portfolioId, queryParams).pipe(
            map(page => page.content as StakeholderReadDTO[]),
            map(stakeholders => {
                let stakeholderWithExactName = stakeholders.find(stakeholder => stakeholder.name == stakeholderName);
                return !!stakeholderWithExactName ? stakeholderWithExactName : undefined;
            })
        );
    }

    // POST - Cria um novo stakeholder num portfólio
    createNewStakeholder(portfolioId: number, name: string): Observable<StakeholderReadDTO> {
        const url = this.getPortfolioStakeholdersUrl(portfolioId);
        const body: StakeholderCreateDTO = { name: name, portfolioId: portfolioId };
        return this.http.post<StakeholderReadDTO>(url, body, { headers: this.getHeaders() });
    }

    // UPDATE - Atualiza os dados básicos do stakeholder
    updateStakeholderBasicInformation(portfolioId: number, stakeholderId: number, name: string): Observable<StakeholderReadDTO> {
        const url = `${this.getPortfolioStakeholdersUrl(portfolioId)}/${stakeholderId}`;

        return this.getStakeholderById(portfolioId, stakeholderId).pipe(
            map(stakeholder => ({ ...stakeholder, name }) as StakeholderUpdateDTO),
            switchMap(body => this.http.put<StakeholderReadDTO>(url, body, { headers: this.getHeaders() }))
        );
    }

    // UPDATE - Atualiza dados da análise do stakeholder
    updateStakeholderAnalysisInformation(
        portfolioId: number,
        stakeholderId: number,
        powerLevel: PortfolioScaleEnumDTO,
        interestLevel: PortfolioScaleEnumDTO,
        powerLevelJustification: string,
        interestLevelJustification: string,
        expectations: string,
        obligationsWithStakeholder: string,
        positivePoints: string,
        negativePoints: string
    ): Observable<StakeholderReadDTO> {
        const url = `${this.getPortfolioStakeholdersUrl(portfolioId)}/${stakeholderId}`;
        return this.getStakeholderById(portfolioId, stakeholderId).pipe(
            map(stakeholder => ({
                ...stakeholder,
                powerLevel: powerLevel,
                powerLevelJustification: powerLevelJustification,
                interestLevel: interestLevel,
                interestLevelJustification: interestLevelJustification,
                expectations: expectations,
                obligationsWithStakeholder: obligationsWithStakeholder,
                positivePoints: positivePoints,
                negativePoints: negativePoints
            }) as StakeholderUpdateDTO),
            switchMap(body => this.http.put<StakeholderReadDTO>(url, body, { headers: this.getHeaders() }))
        );
    }

    // DELETE - Deleta um stakeholder do portfólio
    deleteStakeholder(portfolioId: number, stakeholderId: number): Observable<void> {
        const url = `${this.getPortfolioStakeholdersUrl(portfolioId)}/${stakeholderId}`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }

    // GET - Obtém todos eventos relacionados ao stakeholder
    getEventsByStakeholderId(portfolioId: number, stakeholderId: number, queryParams?: PaginationQueryParams): Observable<Page<EventReadDTO>> {
        const url = `${this.getPortfolioStakeholdersUrl(portfolioId)}/${stakeholderId}/events`;
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams).getParamsInHttpParamsFormat();
        return this.http.get<Page<EventReadDTO>>(url, { headers: this.getHeaders(), params });
    }
}
