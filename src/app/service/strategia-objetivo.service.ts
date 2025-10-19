import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { Objective } from '../interface/interfacies';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class StrategiaObjetivoService {
  private apiUrl = `${environment.apiUrl}/strategies`;

  constructor(private http: HttpClient) {}

  authService = inject(AuthService);
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();
  }

  // Buscar critérios relacionados ao objetivo estratégico
  getObjectiveCriteria(strategyId: number, objectiveId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}/criteria`;
    return this.http.get<Page<any>>(url, {
      headers: this.getHeaders(),
      params: queryParams?.getParamsInHttpParamsFormat()
    });
  }


  // Buscar portfólios relacionados ao objetivo estratégico
  getObjectivePortfolios(strategyId: number, objectiveId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}/portfolios`;
    return this.http.get<Page<any>>(url, {
      headers: this.getHeaders(),
      params: queryParams?.getParamsInHttpParamsFormat()
    });
  }


  // Buscar projetos relacionados ao objetivo estratégico
  getObjectiveProjects(strategyId: number, objectiveId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}/projects`;
    return this.http.get<Page<any>>(url, {
      headers: this.getHeaders(),
      params: queryParams?.getParamsInHttpParamsFormat()
    });
  }


  // Cadastrar novo objetivo estratégico (POST)
  createObjective(strategyId: number, objective: Partial<Objective>): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives`;
    return this.http.post<Objective>(url, objective, { headers: this.getHeaders() });
  }

  // Buscar objetivos estratégicos paginados (GET)
  getObjectivesPage(strategyId: number, queryParams?: PaginationQueryParams): Observable<Page<Objective>> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives`;
    return this.http.get<Page<Objective>>(url, {
      headers: this.getHeaders(),
      params: queryParams?.getParamsInHttpParamsFormat()
    });
  }

  // Buscar objetivo estratégico por ID (GET)
  getObjectiveById(strategyId: number, objectiveId: number): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.get<Objective>(url, { headers: this.getHeaders() });
  }

  // Atualizar objetivo estratégico (PUT)
  updateObjective(strategyId: number, objectiveId: number, objective: Partial<Objective>): Observable<Objective> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.put<Objective>(url, objective, { headers: this.getHeaders() });
  }

  // Desabilitar objetivo estratégico (DELETE soft)
  disableObjective(strategyId: number, objectiveId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }

  // Remover objetivo estratégico (DELETE hard)
  deleteObjective(strategyId: number, objectiveId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/strategic-objectives/${objectiveId}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });

  }
}
