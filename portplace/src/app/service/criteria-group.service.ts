import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { CriteriaGroup } from '../interface/interfacies';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class CriteriaGroupService {

  // Atualizar EvaluationGroup (PUT)
  updateEvaluationGroup(
    evaluationGroupId: number,
    strategyId: number,
    dto: any
  ): Observable<any> {
    const url = `${environment.apiUrl}/strategies/${strategyId}/evaluation-groups/${evaluationGroupId}`;
    return this.http.put<any>(url, dto, { headers: this.getHeaders() });
  }

  constructor(private http: HttpClient) { }

  authService = inject(AuthService);
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();
  }

  // Cadastrar novo projeto (POST)
  createCriterio(criterio: CriteriaGroup, estrategiaId: number): Observable<CriteriaGroup> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups`;
    return this.http.post<CriteriaGroup>(url, criterio, { headers: this.getHeaders() });
  }
  getCriteriaGroupPage(estrategiaId:number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
      return this.http.get<Page<any>>(`${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups`, { params: queryParams?.getParamsInHttpParamsFormat() });
  }
  // Buscar todos os grupo de critérios (GET)
  // TODO: Renomear para getAllCriteriaGroups ou getAllGrupoCriterios
  getAllCriterios(estrategiaId: number): Observable<CriteriaGroup[]> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups`;
    return this.http.get<Page<CriteriaGroup>>(url, { headers: this.getHeaders(), params: { size: 1000 } })
        .pipe(map(page => page.content));
  }
  // Buscar projeto por ID (GET)
  getCriterioById(id: number, estrategiaId: number): Observable<CriteriaGroup> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}`;
    return this.http.get<CriteriaGroup>(url, { headers: this.getHeaders() });
  }

  // Atualizar projeto (PUT)
  updateCriterio(id: number, estrategiaId: number, criterio: CriteriaGroup): Observable<CriteriaGroup> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}`;
    return this.http.put<CriteriaGroup>(url,criterio, { headers: this.getHeaders() })
  }

  // Deletar projeto (DELETE)
  deleteCriterio(id: number,estrategiaId: number): Observable<void> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${id}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() })
  }
}
