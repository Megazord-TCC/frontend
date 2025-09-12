import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Page, PaginationQueryParams } from '../models/pagination-models';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/strategies`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Buscar grupos de avaliação paginados e filtrados
  getEvaluationGroupsPage(strategyId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups`;
    return this.http.get<Page<any>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
  }

  // Buscar todos os grupos de avaliação (sem paginação)
  getAllEvaluationGroups(strategyId: number): Observable<any[]> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups`;
    return this.http.get<Page<any>>(url, { params: { size: 1000 } })
      .pipe(
        // @ts-ignore
        map(page => page.content)
      );
  }

  // Buscar grupo por ID
  getEvaluationGroupById(strategyId: number, evaluationGroupId: number): Observable<any> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups/${evaluationGroupId}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  // Criar grupo de avaliação
  createEvaluationGroup(strategyId: number, dto: any): Observable<any> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups`;
    return this.http.post<any>(url, dto, { headers: this.getHeaders() });
  }

  // Atualizar grupo de avaliação
  updateEvaluationGroup(strategyId: number, evaluationGroupId: number, dto: any): Observable<any> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups/${evaluationGroupId}`;
    return this.http.put<any>(url, dto, { headers: this.getHeaders() });
  }

  // Desabilitar grupo de avaliação (soft delete)
  disableEvaluationGroup(strategyId: number, evaluationGroupId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups/${evaluationGroupId}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  // Deletar grupo de avaliação (hard delete)
  deleteEvaluationGroup(strategyId: number, evaluationGroupId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/evaluation-groups/${evaluationGroupId}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }
}

