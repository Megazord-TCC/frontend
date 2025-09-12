import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Criterion } from '../interface/interfacies';
import { Page, PaginationQueryParams } from '../models/pagination-models';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {

  constructor(private http: HttpClient) { }

  // Headers com Content-Type JSON
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getCriteriaPage(estrategiaId:number, groupId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
      return this.http.get<Page<any>>(`${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria`, { params: queryParams?.getParamsInHttpParamsFormat() });
  }
  getCriteriaObjectivesPage(estrategiaId:number, groupId: number, queryParams?: PaginationQueryParams): Observable<Page<any>> {
      return this.http.get<Page<any>>(`${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria`, { params: queryParams?.getParamsInHttpParamsFormat() });
  }
  // BUSCA DE TODOS OS CRITÉRIOS
  getAllCriterios(estrategiaId: number, groupId: number): Observable<Criterion[]> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria`;
    return this.http.get<Page<Criterion>>(url, { headers: this.getHeaders(), params: { size: 1000 } }).pipe(map(page => page.content));
  }

  getCriterioById(groupId: number, id:number, estrategiaId: number): Observable<Criterion> {
    let url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria/${id}`;
    url += '?includeWeight=true';

    return this.http.get<Criterion>(url, { headers: this.getHeaders() });
  }

  // CADASTRAR DE CRITÉRIO
  createCriterio(criterio: Criterion, estrategiaId: number, groupId: number): Observable<Criterion> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria`;
    return this.http.post<Criterion>(url, criterio, { headers: this.getHeaders() });
  }

  // EDIÇÃO DE CRITÉRIO
  updateCriterio(criterioId: number, criterio: Criterion, estrategiaId: number, groupId: number): Observable<Criterion> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria/${criterioId}`;
    return this.http.put<Criterion>(url, criterio, { headers: this.getHeaders() });
  }

  // DELETAR CRITÉRIO
  deleteCriterio(criterioId: number, estrategiaId: number, groupId: number): Observable<void> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria/${criterioId}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }
}
