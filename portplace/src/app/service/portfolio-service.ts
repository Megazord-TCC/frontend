import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PortfolioDTO, PortfolioDTOStatus } from '../interface/carlos-portfolio-interfaces';

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
                    budget: 150000,
                    projectsInProgress: 2,
                    projectsCompleted: 1,
                    projectsCancelled: 0,
                    status: PortfolioDTOStatus.EM_ANDAMENTO
                },
                {
                    id: 2,
                    name: 'Portfólio Infraestrutura TI',
                    budget: 500000,
                    projectsInProgress: 0,
                    projectsCompleted: 5,
                    projectsCancelled: 1,
                    status: PortfolioDTOStatus.FINALIZADO
                },
                {
                    id: 3,
                    name: 'Portfólio Pesquisa & Desenvolvimento',
                    budget: 200000,
                    projectsInProgress: 0,
                    projectsCompleted: 0,
                    projectsCancelled: 0,
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
            map(page =>  page.content as PortfolioDTO[]),
            map(portfolios => {
                let portfolioWithExactName = portfolios.find(portfolio => portfolio.name == portfolioName);
                return !!portfolioWithExactName ? portfolioWithExactName : undefined;
            })
        );
    }
}
