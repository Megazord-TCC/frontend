import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, of } from 'rxjs';
import { EvaluationGroup, Portfolio, ProjectInclusionStatus, ProjectStatus, Scenario, ScenarioStatus } from '../interface/carlos-interfaces';
import { Page, PaginationQueryParams } from '../models/pagination-models';

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

    // GET - Retorna cenários paginados.
    getScenariosPage(strategyId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
        const url = this.getScenariosUrl(strategyId);
        return this.http.get<Page<any>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // POST - Criar um novo cenário
    createScenario(name: string, description: string, portfolioId: string, evaluationGroupId: string, strategyId: number): Observable<number> {
        const url = this.getScenariosUrl(strategyId);
        const body = {
            name: name,
            description: description,
            budget: 0,
            evaluationGroupId: Number(evaluationGroupId),
            strategyId: Number(strategyId),
            // portfolioId: Number(portfolioId) TODO: Remover comentário quando backend aceitar esse atributo
        };
        return this.http.post<{ id: number }>(url, body, { headers: this.getHeaders() }).pipe(map(response => response.id));
    }

    // GET - Conferir se o nome do cenário já existe
    checkScenarioNameAlreadyExists(scenarioName: string): Observable<boolean> {
        // TODO: Quando for criado endpoint GET-ALL scenarios, conferir se já existe um com esse nome
        return of(false);
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

    // TODO: Este método deveria estar num outro service, quem sabe 'evaluation-group-service' ou 'evaluation-service'
    // GET - Busca todos grupos de avaliação
    getAllEvaluationGroups(strategyId: number): Observable<EvaluationGroup[]> {
        let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${strategyId}/evaluation-groups`;

        return this.http.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
    }

    // GET - Busca detalhes dum cenário. É aquilo que é necessário pra preencher toda a tela de um cenário específico.
    getScenarioDetailsById(scenarioId: number): Observable<Scenario | undefined> {

        // TODO: Substituir por chamada ao backend quando estiver pronto
        return of ({
            id: 1,
            name: "Scenario What-If A",
            description: "Cenário para avaliação de projetos estratégicos de TI",
            userDefinedBudget: 1000000,
            status: ScenarioStatus.AWAITING_AUTHORIZATION,
            budget: 950000,
            lastModifiedAt: new Date(),

            portfolioId: 10,
            portfolioName: "Digital Transformation Portfolio",

            evaluationGroupId: 5,
            evaluationGroupName: "Q1 2025 Evaluation",

            projects: [
                {
                    id: 101,
                    currentOrder: 1,
                    initialOrder: 1,
                    projectId: 1001,
                    projectName: "ERP Cloud Migration",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 85,
                    estimatedCost: 300000,
                    categoryId: 201,
                    estimatedDurationMonths: 12,
                    projectStatus: ProjectStatus.IN_PROGRESS
                },
                {
                    id: 102,
                    currentOrder: 2,
                    initialOrder: 2,
                    projectId: 1002,
                    projectName: "CRM Implementation",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 75,
                    estimatedCost: 200000,
                    categoryId: 202,
                    estimatedDurationMonths: 10,
                    projectStatus: ProjectStatus.CANCELED
                },
                {
                    id: 103,
                    currentOrder: 3,
                    initialOrder: 3,
                    projectId: 1003,
                    projectName: "Data Lake Setup",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 90,
                    estimatedCost: 250000,
                    categoryId: 203,
                    estimatedDurationMonths: 8,
                    projectStatus: ProjectStatus.IN_ANALYSIS
                },
                {
                    id: 104,
                    currentOrder: 4,
                    initialOrder: 4,
                    projectId: 1004,
                    projectName: "Mobile App Development",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 70,
                    estimatedCost: 150000,
                    categoryId: 204,
                    estimatedDurationMonths: 6,
                    projectStatus: ProjectStatus.IN_PROGRESS
                },
                {
                    id: 105,
                    currentOrder: 5,
                    initialOrder: 5,
                    projectId: 1005,
                    projectName: "Cybersecurity Upgrade",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 95,
                    estimatedCost: 180000,
                    categoryId: 205,
                    estimatedDurationMonths: 9,
                    projectStatus: ProjectStatus.IN_PROGRESS
                },
                {
                    id: 106,
                    currentOrder: 6,
                    initialOrder: 6,
                    projectId: 1006,
                    projectName: "AI Chatbot Support",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 60,
                    estimatedCost: 120000,
                    categoryId: 206,
                    estimatedDurationMonths: 5,
                    projectStatus: ProjectStatus.IN_PROGRESS
                },
                {
                    id: 107,
                    currentOrder: 7,
                    initialOrder: 7,
                    projectId: 1007,
                    projectName: "Network Infrastructure Upgrade",
                    inclusionStatus: ProjectInclusionStatus.INCLUDED,
                    strategicValue: 80,
                    estimatedCost: 220000,
                    categoryId: 207,
                    estimatedDurationMonths: 7,
                    projectStatus: ProjectStatus.IN_PROGRESS
                }
            ]
        });
    }

    // // Buscar projeto por ID (GET)
    // getCriterioById(id: number, estrategiaId: number): Observable<CriteriaGroup> {
    //     const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}`;
    //     return this.http.get<CriteriaGroup>(url, { headers: this.getHeaders() });
    // }

    // // Atualizar projeto (PUT)
    // updateCriterio(id: number, estrategiaId: number, criterio: CriteriaGroup): Observable<CriteriaGroup> {
    //     const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}`;
    //     return this.http.put<CriteriaGroup>(url, criterio, { headers: this.getHeaders() })
    // }

    // // Deletar projeto (DELETE)
    // deleteCriterio(id: number, estrategiaId: number): Observable<void> {
    //     const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}/hard-delete`;
    //     return this.http.delete<void>(url, { headers: this.getHeaders() })
    // }
}
