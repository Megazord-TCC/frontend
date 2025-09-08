import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
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

    private getPortfoliosUrl(strategyId: number): string {
        return `${environment.apiUrl}/strategies/${strategyId}/scenarios`;
    }

    // GET - Buscar todos portfólios
    getAllPortfolios(queryParams?: PaginationQueryParams): Observable<Page<PortfolioDTO>> {
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
}
