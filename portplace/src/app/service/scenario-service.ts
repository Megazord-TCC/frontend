import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { filter, map, Observable, of } from 'rxjs';
import { EvaluationGroup, Portfolio, ProjectInclusionStatus, ProjectStatus, Scenario, ScenarioStatus } from '../interface/carlos-interfaces';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioUpdateDTO } from '../interface/carlos-scenario-dtos';
import { ProjectReadDTO } from '../interface/carlos-project-dtos';
import { PortfolioDTOStatus, PortfolioListReadDTO } from '../interface/carlos-portfolio-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class ScenarioService {
    constructor(private http: HttpClient) { }

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getScenariosUrl(strategyId: number): string {
        return `${environment.apiUrl}/strategies/${strategyId}/scenarios`;
    }

    private getScenarioProjectsUrl(strategyId: number, scenarioId: number): string {
        return `${this.getScenariosUrl(strategyId)}/${scenarioId}/rankings`;
    }

    private getPortfolioUrl(): string {
        return `${environment.apiUrl}/portfolios`;
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

    // POST - Autoriza um cenário em aguardo de autorização
    authorizeCenario(strategyId: number, scenarioId: number): Observable<void> {
        const url = `${this.getScenariosUrl(strategyId)}/${scenarioId}/authorize`;
        return this.http.post<void>(url, undefined, { headers: this.getHeaders() });
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

    updateProjectInclusionStatus(strategyId: number, scenarioId: number, rankingId: number, status: ScenarioRankingStatusEnum): Observable<any> {
        const url = `${this.getScenarioProjectsUrl(strategyId, scenarioId)}/${rankingId}`;
        return this.http.put<any>(url, { status }, { headers: this.getHeaders() });
    }

    // Utilizado para atualizar a categoria do projeto do cenário.
    // O status não deveria precisar ser informado, pois não está sendo alterado.
    // Se quiser atualizar o status, utilizar updateProjectInclusionStatus.
    updateScenarioProject(
        strategyId: number,
        scenarioId: number,
        rankingId: number,
        status: ScenarioRankingStatusEnum,
        categoryId: number
    ): Observable<any> {
        const url = `${this.getScenarioProjectsUrl(strategyId, scenarioId)}/${rankingId}`;
        let body = { status, portfolioCategoryId: categoryId };
        return this.http.put<any>(url, body, { headers: this.getHeaders() });
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
            portfolioId: Number(portfolioId)
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

    // GET - Buscar todos portfólios não cancelados
    // Obs: não foi chamado o método de PortfolioService pra evitar dependência circular entre services.
    getAllPortfoliosNotCancelled(): Observable<PortfolioListReadDTO[]> {
        const url = this.getPortfolioUrl();

        let params = new HttpParams()
            .set('size', '100000')
            .append('status', PortfolioDTOStatus.EM_ANDAMENTO)
            .append('status', PortfolioDTOStatus.FINALIZADO)
            .append('status', PortfolioDTOStatus.VAZIO);

        return this.http.get<Page<PortfolioListReadDTO>>(url, { params })
            .pipe(map(page => page.content as PortfolioListReadDTO[]));
    }

    // GET - Buscar todos portfólios
    // Obs: não foi chamado o método de PortfolioService pra evitar dependência circular entre services.
    getAllPortfolios(): Observable<PortfolioListReadDTO[]> {
        const url = this.getPortfolioUrl();

        let params = new HttpParams().set('size', '100000');

        return this.http.get<Page<PortfolioListReadDTO>>(url, { params })
            .pipe(map(page => page.content as PortfolioListReadDTO[]));
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

    // TODO: Este método deveria estar num outro service, quem sabe 'evaluation-group-service' ou 'evaluation-service'
    // GET - Busca todos grupos de avaliação
    getAllEvaluationGroups(strategyId: number): Observable<EvaluationGroup[]> {
        let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${strategyId}/evaluation-groups`;

        return this.http.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
    }
}
