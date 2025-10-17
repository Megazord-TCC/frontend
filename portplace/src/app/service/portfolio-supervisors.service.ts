import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { filter, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { UserGetResponseDTO, UserStatusEnumDTO } from '../interface/carlos-user-interfaces';
import { UserService } from './user-service';
import { RoleDTO } from '../interface/carlos-auth-interfaces';
import { subtractArraysById } from '../helpers/array-helper';
import { PortfolioOwnersCreateDTO } from '../interface/carlos-portfolio-supervisors-interfaces';
import { PortfolioService } from './portfolio-service';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class PortfolioSupervisorService {
    http = inject(HttpClient);
    userService = inject(UserService);
    portfolioService = inject(PortfolioService);

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getPortfolioSupervisorsUrl(portfolioId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/owners`;
    }

    // GET - Buscar os responsáveis do portfólio
    getPortfolioSupervisorsPage(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<UserGetResponseDTO>> {
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams).getParamsInHttpParamsFormat();

        return this.http.get<Page<UserGetResponseDTO>>(this.getPortfolioSupervisorsUrl(portfolioId), { params });
    }

    // GET - Retorna os PMOs ativos que ainda não são responsáveis por esse portfólio
    getAllActivePMOsNotSupervisingThisPortfolio(portfolioId: number): Observable<UserGetResponseDTO[]> {
        let allPmosParams = new PaginationQueryParams();
        allPmosParams.size = 10000;
        allPmosParams.extraQueryParams = [{ name: 'status', value: UserStatusEnumDTO.ACTIVE }];

        let allPmosInThisPortfolioParams = new PaginationQueryParams();
        allPmosInThisPortfolioParams.size = 10000;

        return forkJoin({
            allPmos: this.userService.getUsersPage(allPmosParams).pipe(
                map(page => page.content),
                map(pmos => pmos.filter(pmo => pmo.role == RoleDTO.PMO || pmo.role == RoleDTO.PMO_ADM))
            ),
            allPmosInThisPortfolio: this.getPortfolioSupervisorsPage(portfolioId, allPmosInThisPortfolioParams).pipe(map(page => page.content))
        }).pipe(
            map(({allPmos, allPmosInThisPortfolio}) => (subtractArraysById(allPmos, allPmosInThisPortfolio))),
            map(pmos => pmos.sort((a, b) => a.name.localeCompare(b.name)))
        );
    }

    // POST - Adiciona um novo responsável ao portfólio
    addNewPortfolioSupervisor(portfolioId: number, newSupervisorUserId: number): Observable<any> {
        const url = `${this.getPortfolioSupervisorsUrl(portfolioId)}`;
        const body: PortfolioOwnersCreateDTO = { ownersIds: [newSupervisorUserId] };

        return this.portfolioService.getPortfolioById(portfolioId).pipe(
            switchMap(portfolio => {
                portfolio.owners.forEach(owner => body.ownersIds.push(owner.id));
                return this.http.post(url, body, { headers: this.getHeaders() });
            })
        );
    }

    // POST - Remove um responsável do portfólio
    removePortfolioSupervisor(portfolioId: number, supervisorUserIdToRemove: number): Observable<any> {
        const url = `${this.getPortfolioSupervisorsUrl(portfolioId)}`;
        const body: PortfolioOwnersCreateDTO = { ownersIds: [] };

        return this.portfolioService.getPortfolioById(portfolioId).pipe(
            switchMap(portfolio => {
                portfolio.owners.forEach(owner => {
                    if (owner.id != supervisorUserIdToRemove) body.ownersIds.push(owner.id);
                });
                return this.http.post(url, body, { headers: this.getHeaders() });
            })
        );
    }
}
