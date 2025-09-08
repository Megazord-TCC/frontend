import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioCostStatus, PortfolioDTO, PortfolioDTOStatus, PortfolioProgressStatus, PortfolioSummaryTab } from '../interface/carlos-portfolio-interfaces';

@Injectable({
    providedIn: 'root'
})
export class PortfolioService {
    http = inject(HttpClient);

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
    getPortfoliosPage(queryParams?: PaginationQueryParams): Observable<Page<PortfolioDTO>> {
        // TODO: Chamar endpoint GET-ALL portfolios, quando ele for criado
        return of({
            content: [
                {
                    id: 1,
                    name: 'Portfólio Marketing Digital',
                    description: 'Portfólio focado em campanhas de marketing digital para aumentar a presença online da empresa.',
                    budget: 150000,
                    projectsInProgress: 2,
                    projectsCompleted: 1,
                    projectsCancelled: 0,
                    createdAt: new Date(),
                    status: PortfolioDTOStatus.EM_ANDAMENTO
                },
                {
                    id: 2,
                    name: 'Portfólio Infraestrutura TI',
                    description: 'Portfólio dedicado à modernização e expansão da infraestrutura de TI da empresa.',
                    budget: 500000,
                    projectsInProgress: 0,
                    projectsCompleted: 5,
                    projectsCancelled: 1,
                    createdAt: new Date(),
                    status: PortfolioDTOStatus.FINALIZADO
                },
                {
                    id: 3,
                    name: 'Portfólio Pesquisa & Desenvolvimento',
                    description: 'Portfólio voltado para projetos de inovação e desenvolvimento de novos produtos.',
                    budget: 200000,
                    projectsInProgress: 0,
                    projectsCompleted: 0,
                    projectsCancelled: 0,
                    createdAt: new Date(),
                    status: PortfolioDTOStatus.VAZIO
                }
            ],
            pageable: {
                pageNumber: 0,
                pageSize: 10,
                sort: {
                    empty: true,
                    sorted: false,
                    unsorted: true
                },
                offset: 0,
                paged: true,
                unpaged: false
            },
            last: true,
            totalElements: 3,
            totalPages: 1,
            size: 10,
            number: 0,
            sort: {
                empty: true,
                sorted: false,
                unsorted: true
            },
            numberOfElements: 3,
            first: true,
            empty: false,
        });
    }

    // GET - Busca portfólio por ID
    getPortfolioById(portfolioId: number): Observable<PortfolioDTO> {
        // TODO - Chamar endpoint GET portfolio by ID, quando ele for criado
        // const url = this.getPortfolioDetailUrl(portfolioId);
        // return this.http.get<PortfolioDTO>(url);

        return this.getPortfoliosPage().pipe(
            map(page => page.content),
            map(portfolios => portfolios.find(portfolio => portfolio.id === portfolioId) as PortfolioDTO)
        );
    }

    getPortfolioSummaryTabById(portfolioId: number): Observable<PortfolioSummaryTab> {
        // TODO - Chamar endpoint GET portfolio summary tab by ID, quando ele for criado

        return of({
            portfolioId: 1,
            budget: 'R$ 150.000,00',
            costStatus: PortfolioCostStatus.WITHIN_BUDGET,
            progressStatus: PortfolioProgressStatus.ON_TRACK,
            strategyName: "Expansão de Mercado LATAM",
            responsibleUserNames: ["Alice Johnson", "Bruno Martins"]
        });
    }

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
    getPortfolioByExactName(portfolioName: string): Observable<PortfolioDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: portfolioName };

        return this.getPortfoliosPage(queryParams).pipe(
            map(page => page.content as PortfolioDTO[]),
            map(portfolios => {
                let portfolioWithExactName = portfolios.find(portfolio => portfolio.name == portfolioName);
                return !!portfolioWithExactName ? portfolioWithExactName : undefined;
            })
        );
    }
}
