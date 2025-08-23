import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CriteriaComparison, CriteriaGroup } from '../interface/interfacies';
import { Page } from '../interface/carlos-interfaces';

@Injectable({
  providedIn: 'root'
})
export class GrupoCriterioService {

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // BUSCA DE TODOS OS GRUPOS DE CRITÉRIOS
  getCriteriaComparisons(groupId: number,estrategiaId: number): Observable<CriteriaComparison[]> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria-comparisons`;
    return this.http.get<Page<CriteriaComparison>>(url, { headers: this.getHeaders(), params: { size: 1000 } }).pipe(map(page => page.content));
  }

  // BUSCA DE UM GRUPO DE CRITÉRIOS POR ID
  getCriteriaComparisonById(groupComparationId: number,groupId: number,estrategiaId: number): Observable<CriteriaComparison> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria-comparisons/${groupComparationId}`;
    return this.http.get<CriteriaComparison>(url, { headers: this.getHeaders() });
  }

  // CADASTRAR GRUPO DE CRITÉRIOS
  createCriteriaComparison(grupoCriterio: CriteriaComparison,groupId: number, estrategiaId: number): Observable<CriteriaComparison> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria-comparisons`;
    return this.http.post<CriteriaComparison>(url, grupoCriterio, { headers: this.getHeaders() });
  }

  // EDIÇÃO DE GRUPO DE CRITÉRIOS
  updateCriteriaComparison( grupoCriterio: CriteriaComparison,groupComparationId: number,groupId: number, estrategiaId: number): Observable<CriteriaComparison> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria-comparisons/${groupComparationId}`;
    return this.http.put<CriteriaComparison>(url, grupoCriterio, { headers: this.getHeaders() });
  }

  // DELETAR GRUPO DE CRITÉRIOS
  deleteCriteriaComparison(groupComparationId: number, groupId: number, estrategiaId: number): Observable<void> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups/${groupId}/criteria-comparisons/${groupComparationId}/hard-delete`;
    return this.http.delete<void>(url, { headers: this.getHeaders() });
  }
}
