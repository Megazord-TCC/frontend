import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { filter, map, Observable, of } from 'rxjs';
import { EvaluationGroup, Portfolio, ProjectInclusionStatus, ProjectStatus, Scenario, ScenarioStatus } from '../interface/carlos-interfaces';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioUpdateDTO } from '../interface/carlos-scenario-dtos';
import { ProjectReadDTO } from '../interface/carlos-project-dtos';

@Injectable({
    providedIn: 'root'
})
export class ScenarioService {
    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    private getScenariosUrl(strategyId: number): string {
        return `${environment.apiUrl}/strategies/${strategyId}/scenarios`;
    }

    private getScenarioProjectsUrl(strategyId: number, scenarioId: number): string {
        return `${this.getScenariosUrl(strategyId)}/${scenarioId}/rankings`;
    }

    // UPDATE - Realizar inclusão/remoção de projetos no cenário por meio da alteração de status (parâmetro 'status')
    updateScenarioRanking(strategyId: number, scenarioId: number, rankingId: number): Observable<void> {
        const url = `${this.getScenarioProjectsUrl(strategyId, scenarioId)}/${rankingId}`;
        return this.http.put<void>(url, { status }, { headers: this.getHeaders() });
    }

    // UPDATE - Atualizar dados do cenário (não se refere a dados do ranking/projetos do cenário)
    updateScenario(strategyId: number, scenarioId: number, body: ScenarioUpdateDTO): Observable<void> {
        const url = `${this.getScenariosUrl(strategyId)}/${scenarioId}`;
        return this.http.put<void>(url, body, { headers: this.getHeaders() });
    }

    // GET - Retorna a lista de projetos de um cenário, informando se foi incluído/removido
    getScenarioProjects(strategyId: number, scenarioId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
        const url = this.getScenarioProjectsUrl(strategyId, scenarioId);
        return this.http.get<Page<any>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET - Retorna cenários paginados.
    getScenariosPage(strategyId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
        const url = this.getScenariosUrl(strategyId);
        queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
        return this.http.get<Page<any>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET - Busca cenário por ID
    getScenarioById(strategyId: number, scenarioId: number): Observable<any> {
        const url = `${this.getScenariosUrl(strategyId)}/${scenarioId}`;
        return this.http.get<any>(url);
    }

    // UPDATE - Atualiza status de inclusão dum projeto num cenário. Ex: "Incluído" para "Removido (manual)"
    updateProjectInclusionStatus(strategyId: number, scenarioId: number, rankingId: number, status: ScenarioRankingStatusEnum): Observable<any> {
        const url = `${this.getScenarioProjectsUrl(strategyId, scenarioId)}/${rankingId}`;
        return this.http.put<any>(url, { status }, { headers: this.getHeaders() });
    }

    deleteScenario(strategyId: number, scenarioId: number): Observable<void> {
        const url = `${this.getScenariosUrl(strategyId)}/${scenarioId}`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }

    // POST - Criar um novo cenário
    createScenario(
        name: string,
        description: string,
        portfolioId: string,
        evaluationGroupId: string,
        strategyId: number,
        budget: number // novo parâmetro
    ): Observable<number> {
        const url = this.getScenariosUrl(strategyId);
        const body = {
            name: name,
            description: description,
            budget: budget,
            evaluationGroupId: Number(evaluationGroupId),
            strategyId: Number(strategyId),
            // portfolioId: Number(portfolioId) TODO: Remover comentário quando backend aceitar esse atributo
        };
        return this.http.post<{ id: number }>(url, body, { headers: this.getHeaders() }).pipe(map(response => response.id));
    }

    // GET - Conferir se o nome do cenário já existe. O nome tem que ser exatamente igual e por completo.
    getScenarioByExactName(strategyId: number, scenarioName: string): Observable<ScenarioReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: scenarioName };

        return this.getScenariosPage(strategyId, queryParams).pipe(
            map(page =>  page.content as ScenarioReadDTO[]),
            map(scenarios => {
                let scenarioWithExactName = scenarios.find(scenario => scenario.name == scenarioName);
                if (scenarioWithExactName)
                    return scenarioWithExactName;
                else
                    return undefined;
            })
        );
    }

    // TODO: Este método deveria estar no service de portfólios
    // GET - Buscar todos portfólios
    getAllPortfolios(): Observable<Portfolio[]> {
        // TODO: Chamar endpoint GET-ALL portfolios, quando ele for criado
        return of([
            {
                id: 0,
                name: 'Portfolio 1'
            },
            {
                id: 1,
                name: 'Portfolio 2'
            }
        ]);
    }

    // TODO: Este método deveria estar no service de portfólios
    // GET - Buscar portfólio por ID
    getPortfolioById(portfolioId: number): Observable<Portfolio | undefined> {
        // TODO: Chamar endpoint GET-PORTFOLIO por ID, quando ele for criado
        return of({
            id: portfolioId,
            name: `Portfolio ${portfolioId + 1}`
        });
    }

    // TODO: Mover este método pro service de portfólio ou de projeto
    // GET - Busca nomes dos projetos de um portfólio específico
    getProjectsNamesByPortfolioId(portfolioId: number): Observable<{ id: number, name: string }[]> {
        // TODO: Chamar endpoint GET-PROJECTS por ID, quando ele for criado
        return of([
            {
                id: 0,
                name: 'Projeto 1'
            },
            {
                id: 1,
                name: 'Projeto 2'
            }
        ]);
    }

    getPortfolioCategoriesByPortfolioId(portfolioId: number): Observable<{ id: number, name: string }[]> {
        // TODO: Chamar endpoint GET-PORTFOLIO-CATEGORIES por ID, quando ele for criado
        return of([
            {
                id: 0,
                name: 'Categoria 1'
            },
            {
                id: 1,
                name: 'Categoria 2'
            }
        ]);
    }

    // TODO: Este método deveria estar num outro service, quem sabe 'evaluation-group-service' ou 'evaluation-service'
    // GET - Busca todos grupos de avaliação
    getAllEvaluationGroups(strategyId: number): Observable<EvaluationGroup[]> {
        let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${strategyId}/evaluation-groups`;

        return this.http.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
    }
}
