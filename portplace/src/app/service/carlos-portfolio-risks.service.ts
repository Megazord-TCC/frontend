import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { RiskCreateDTO, RiskReadDTO, RiskScaleEnumDTO, RiskUpdateDTO } from '../interface/carlos-risk-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class CarlosPortfolioRisksService {
    constructor(private http: HttpClient) { }

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getPortfolioRisksUrl(portfolioId: number): string {
        return `${environment.apiUrl}/portfolios/${portfolioId}/risks`;
    }

    // GET - Buscar página com todos riscos do portfólio
    getPortfolioRisksPage(portfolioId: number, queryParams?: PaginationQueryParams): Observable<Page<RiskReadDTO>> {
        const url = this.getPortfolioRisksUrl(portfolioId);
        const params = queryParams?.getParamsInHttpParamsFormat();
        return this.http.get<Page<RiskReadDTO>>(url, { headers: this.getHeaders(), params });
    }

    // POST - Criar um novo risco no portfólio
    createRiskInPortfolio(portfolioId: number, name: string, description: string): Observable<RiskReadDTO> {
        const url = this.getPortfolioRisksUrl(portfolioId);
        const body: RiskCreateDTO = { name, description, portfolioId };
        return this.http.post<RiskReadDTO>(url, body, { headers: this.getHeaders() });
    }

    // GET - Conferir se o nome do risco já existe
    getRiskByExactName(portfolioId: number, riskName: string): Observable<RiskReadDTO | undefined> {
        let queryParams = new PaginationQueryParams();
        queryParams.filterTextQueryParam = { name: 'searchQuery', value: riskName };

        return this.getPortfolioRisksPage(portfolioId, queryParams).pipe(
            map(page => page.content as RiskReadDTO[]),
            map(risks => {
                let riskWithExactName = risks.find(risk => risk.name == riskName);
                return !!riskWithExactName ? riskWithExactName : undefined;
            })
        );
    }

    // GET - Buscar risco pelo ID
    getRiskById(portfolioId: number, riskId: number): Observable<RiskReadDTO> {
        const url = `${this.getPortfolioRisksUrl(portfolioId)}/${riskId}`;
        return this.http.get<RiskReadDTO>(url, { headers: this.getHeaders() });
    }

    // DELETE - Excluir risco pelo ID
    deleteRisk(portfolioId: number, riskId: number): Observable<void> {
        const url = `${this.getPortfolioRisksUrl(portfolioId)}/${riskId}/hard-delete`;
        return this.http.delete<void>(url, { headers: this.getHeaders() });
    }

    // PUT - Atualizar análise do risco
    updateRiskAnalysisById(
        portfolioId: number,
        riskId: number,
        probability: RiskScaleEnumDTO,
        probabilityDescription: string,
        impact: RiskScaleEnumDTO,
        impactDescription: string,
        preventionPlan: string,
        contingencyPlan: string
    ): Observable<RiskReadDTO> {
        const url = `${this.getPortfolioRisksUrl(portfolioId)}/${riskId}`;

        return this.getRiskById(portfolioId, riskId).pipe(
            switchMap((risk => {
                const body: RiskUpdateDTO = {
                    name: risk.name,
                    description: risk.description,
                    disabled: risk.disabled,
                    probability,
                    probabilityDescription,
                    impact,
                    impactDescription,
                    preventionPlan,
                    contingencyPlan,
                };

                return this.http.put<RiskReadDTO>(url, body, { headers: this.getHeaders() });
            }))
        );
    }

    // PUT - Atualizar dados básicos do risco (nome e descrição)
    updateRiskBasicDataById(
        portfolioId: number,
        riskId: number,
        name: string,
        description: string
    ): Observable<RiskReadDTO> {
        const url = `${this.getPortfolioRisksUrl(portfolioId)}/${riskId}`;

        return this.getRiskById(portfolioId, riskId).pipe(
            switchMap((risk => {
                const body: RiskUpdateDTO = {
                    name,
                    description,
                    probability: risk.probability,
                    probabilityDescription: risk.probabilityDescription,
                    impact: risk.impact,
                    impactDescription: risk.impactDescription,
                    preventionPlan: risk.preventionPlan,
                    contingencyPlan: risk.contingencyPlan,
                    disabled: risk.disabled
                };

                return this.http.put<RiskReadDTO>(url, body, { headers: this.getHeaders() });
            }))
        );
    }
}
