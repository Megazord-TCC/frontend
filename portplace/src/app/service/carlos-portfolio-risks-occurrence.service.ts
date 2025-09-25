import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { count, filter, map, Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { RiskOccurrenceCreateDTO, RiskOccurrenceReadDTO, RiskOccurrenceStatusEnumDTO, RiskOccurrenceUpdateDTO } from '../interface/carlos-risk-occurrence-interfaces';
import { CarlosPortfolioRisksService } from './carlos-portfolio-risks.service';

@Injectable({
    providedIn: 'root'
})
export class CarlosPortfolioRiskOccurrenceService {
    http = inject(HttpClient);
    riskService = inject(CarlosPortfolioRisksService);

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    private getOccurrencesUrl(portfolioId: number, riskId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/risks/${riskId}/occurrences`;
    }

    // GET - Buscar página com todas ocorrências do risco
    getRiskOccurrencesPage(portfolioId: number, riskId: number, queryParams?: PaginationQueryParams): Observable<Page<RiskOccurrenceReadDTO>> {   
        const url = this.getOccurrencesUrl(portfolioId, riskId);
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('status', queryParams).getParamsInHttpParamsFormat();
        return this.http.get<Page<RiskOccurrenceReadDTO>>(url, { headers: this.getHeaders(), params });
    }

    // POST - Criar nova ocorrência de risco
    createRiskOccurrence(
        portfolioId: number, 
        riskId: number, 
        occurrenceDate: string, 
        description: string, 
        resolutionDate?: string
    ): Observable<RiskOccurrenceReadDTO> {
        const url = this.getOccurrencesUrl(portfolioId, riskId);
        const body: RiskOccurrenceCreateDTO = {
            description,
            dateOfOccurrence: occurrenceDate,
            solvedAt: resolutionDate ?? null,
            riskId  : riskId
        };
        return this.http.post<RiskOccurrenceReadDTO>(url, body, { headers: this.getHeaders() });
    }

    // UPDATE - Atualizar ocorrência de risco
    updateRiskOccurrence(
        portfolioId: number,
        riskId: number,
        occurrenceId: number,
        occurrenceDate: string,
        description: string,
        resolutionDate?: string
    ): Observable<RiskOccurrenceReadDTO> {
        const url = `${this.getOccurrencesUrl(portfolioId, riskId)}/${occurrenceId}`;
        const body: RiskOccurrenceUpdateDTO = {
            description,
            dateOfOccurrence: occurrenceDate,
            solvedAt: resolutionDate ?? null
        };
        return this.http.put<RiskOccurrenceReadDTO>(url, body, { headers: this.getHeaders() });
    }

    // DELETE - Deletar ocorrência de risco
    deleteRiskOccurrence(portfolioId: number, riskId: number, occurrenceId: number): Observable<void> {
        const url = `${this.getOccurrencesUrl(portfolioId, riskId)}/${occurrenceId}/hard-delete`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }
    
    // GET - Buscar ocorrência de risco pelo ID
    getRiskOccurrenceById(portfolioId: number, riskId: number, occurrenceId: number): Observable<RiskOccurrenceReadDTO> {
        const url = `${this.getOccurrencesUrl(portfolioId, riskId)}/${occurrenceId}`;
        return this.http.get<RiskOccurrenceReadDTO>(url, { headers: this.getHeaders() });
    }

    // GET - Buscar quantidade de ocorrências não resolvidas
    getNotSolvedRiskOccurrencesCountByRiskId(portfolioId: number, riskId: number): Observable<number> {
        const url = `${this.getOccurrencesUrl(portfolioId, riskId)}`;
        return this.riskService.getRiskById(portfolioId, riskId).pipe(
            map(risk => risk.occurrences?.filter(o => o.status == RiskOccurrenceStatusEnumDTO.NOT_SOLVED).length ?? 0)
        );
    }

    // GET - Buscar quantidade de ocorrências não resolvidas para todos os riscos do portfólio
    getNotSolvedRiskOccurrencesCountByPortfolioId(portfolioId: number): Observable<number> {
        const params = new PaginationQueryParams();
        params.size = 100000;

        return this.riskService.getPortfolioRisksPage(portfolioId, params).pipe(
            map(page => page.content),
            map(risks => risks.flatMap(risk => risk.occurrences ?? [])),
            map(occurrences => occurrences.filter(o => o.status == RiskOccurrenceStatusEnumDTO.NOT_SOLVED)),
            map(occurrences => occurrences.length)
        );
    }
}
