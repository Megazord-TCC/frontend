import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioCostStatus, PortfolioListReadDTO, PortfolioProgressStatus, PortfolioReadDTO, PortfolioSummaryTab, PortfolioUpdateDTO } from '../interface/carlos-portfolio-interfaces';
import { ScenarioService } from './scenario-service';
import { ProjectReadDTO2 } from '../interface/carlos-project-dtos';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    http = inject(HttpClient);
    scenarioService = inject(ScenarioService);

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
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

    deletePortfolio(portfolioId: number): Observable<void> {
        const url = `${this.getPortfolioDetailUrl(portfolioId)}/hard-delete`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }
}
