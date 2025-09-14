import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { Objective } from '../interface/interfacies';

@Injectable({
  providedIn: 'root'
})
export class StrategiaObjetivoService {
  private apiUrl = `${environment.apiUrl}/strategies`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // GET paginado de objetivos de uma estratégia
  getObjectivesPage(strategyId: number, queryParams?: PaginationQueryParams): Observable<Page<Objective>> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives`;
    return this.http.get<Page<Objective>>(url, {
      headers: this.getHeaders(),
      params: queryParams?.getParamsInHttpParamsFormat()
    });
  }

  // GET objetivo individual
  getObjectiveById(strategyId: number, objectiveId: number): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.get<Objective>(url, { headers: this.getHeaders() });
  }

  // POST criar objetivo
  createObjective(strategyId: number, dto: any): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives`;
    return this.http.post<Objective>(url, dto, { headers: this.getHeaders() });
  }

  // PUT atualizar objetivo
  updateObjective(strategyId: number, objectiveId: number, dto: any): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.put<Objective>(url, dto, { headers: this.getHeaders() });
  }

  // DELETE (soft) desabilitar objetivo
  disableObjective(strategyId: number, objectiveId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  // DELETE (hard) remover objetivo
  deleteObjective(strategyId: number, objectiveId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }
}
