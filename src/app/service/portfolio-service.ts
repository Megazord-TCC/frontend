import { QueryParam } from './../models/pagination-models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of, switchMap } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioAnalyticsReadDTO, PortfolioCancelationPatchDTO, PortfolioCostStatus, PortfolioListReadDTO, PortfolioProgressStatus, PortfolioReadDTO, PortfolioSummaryTab, PortfolioUpdateDTO } from '../interface/carlos-portfolio-interfaces';
import { ScenarioService } from './scenario-service';
import { ProjectReadDTO2 } from '../interface/carlos-project-dtos';
import { NumberValueAccessor } from '@angular/forms';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    http = inject(HttpClient);
    scenarioService = inject(ScenarioService);

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getPortfolioUrl(): string {
        return `${environment.apiUrl}/portfolios`;
    }

    private getPortfolioDetailUrl(portfolioId: number): string {
        return `${this.getPortfolioUrl()}/${portfolioId}`;
    }

    // GET - Buscar todos portfólios
    getPortfoliosPage(queryParams?: PaginationQueryParams): Observable<Page<PortfolioListReadDTO>> {
        // TODO: Chamar endpoint GET-ALL portfolios, quando ele for criado
        const url = this.getPortfolioUrl();
        queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
        return this.http.get<Page<PortfolioListReadDTO>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET - Busca portfólio por ID
    getPortfolioById(portfolioId: number): Observable<PortfolioReadDTO> {
        const url = this.getPortfolioDetailUrl(portfolioId);
        return this.http.get<PortfolioReadDTO>(url);
    }

    getProjectNamesByPortfolioId(portfolioId: number): Observable<{ id: number, name: string }[]> {
        return this.getPortfolioById(portfolioId).pipe(
            map(portfolio => portfolio.projects ?? []),
            map(projects => projects.map(project => ({ id: project.id, name: project.name })))
        );
    }

    // TODO: Backend vai ter que implementar esse endpoint
    // ou
    // Conferir se backend dá exception na exclusão, daí usa a exception pra mostrar erro
    isPortfolioRelatedToAnyScenario(portfolioId: number): Observable<boolean> {
        return of(false);
    }

    // POST - Criar um novo portfólio
    createPortfolio(name: string, description: string): Observable<number> {
        const url = this.getPortfolioUrl();
        const body = { name: name, description: description };
        return this.http.post<{ id: number }>(url, body, { headers: this.getHeaders() })
            .pipe(map(response => response.id));
    }

    // GET - Conferir se o nome do portfólio já existe. O nome tem que ser exatamente igual e por completo.
    getPortfolioByExactName(portfolioName: string): Observable<PortfolioListReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: portfolioName };

        return this.getPortfoliosPage(queryParams).pipe(
            map(page => page.content as PortfolioListReadDTO[]),
            map(portfolios => {
                let portfolioWithExactName = portfolios.find(portfolio => portfolio.name == portfolioName);
                return !!portfolioWithExactName ? portfolioWithExactName : undefined;
            })
        );
    }

    // GET - Buscar todos os projetos de um portfólio específico
    getProjectsPageByPortfolioId(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<ProjectReadDTO2>> {
        const url = `${environment.apiUrl}/projects`;
        queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
        let params = queryParams.getParamsInHttpParamsFormat().set('portfolioId', portfolioId.toString());

        return this.http.get<Page<ProjectReadDTO2>>(url, { params });
    }

    // UPDATE - Atualizar dados básicos do portfólio
    updatePortfolio(portfolioId: number, body: PortfolioUpdateDTO): Observable<void> {
        const url = this.getPortfolioDetailUrl(portfolioId);
        return this.http.put<void>(url, body, { headers: this.getHeaders() });
    }

    updatePortfolioCommunicationStorageDescription(portfolioId: number, description: string): Observable<void> {
        const url = this.getPortfolioDetailUrl(portfolioId);

        return this.getPortfolioById(portfolioId).pipe(
            map(portfolio => ({
                name: portfolio.name,
                description: portfolio.description,
                communicationStorageDescription: description
            }) as PortfolioUpdateDTO),
            switchMap(body => this.http.put<void>(url, body, { headers: this.getHeaders() }))
        );
    }

    // PATCH - Cancelar portfólio
    cancelPortfolio(portfolioId: number, reason: string): Observable<void> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/cancel`;

        const body = new PortfolioCancelationPatchDTO();
        body.cancellationReason = reason;

        return this.http.patch<void>(url, body, { headers: this.getHeaders() });
    }

    deletePortfolio(portfolioId: number): Observable<void> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/hard-delete`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }

    getPortfolioAnalytics(portfolioId: number): Observable<any> {
        const url = `${environment.apiUrl}/portfolios/${portfolioId}/analytics`;

        return this.http.get<PortfolioAnalyticsReadDTO>(url, { headers: this.getHeaders() });
    }
    getPortfolios(queryParams: PaginationQueryParams):  Observable<Page<PortfolioListReadDTO>> {
        const url = this.getPortfolioUrl();
        queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
        return this.http.get<Page<PortfolioListReadDTO>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET - Exportar analytics para Excel
    exportPortfolioExcel(portfolioId: number): Observable<Blob> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/analytics/excel`;
        return this.http.get(url, {
            headers: this.getHeaders(),
            responseType: 'blob'
        });
    }

    // GET - Exportar portfolio para PDF
    exportPortfolioPdf(portfolioId: number): Observable<Blob> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/analytics/pdf`;
        return this.http.get(url, {
            headers: this.getHeaders(),
            responseType: 'blob'
        });
    }

    completePortfolio(portfolioId: number): Observable<void> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/complete`;
        return this.http.patch<void>(url, {}, { headers: this.getHeaders() });
    }    
}
