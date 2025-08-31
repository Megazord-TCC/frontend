import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';
import { CriteriaGroup } from '../interface/interfacies';
import { Page } from '../models/pagination-models';

@Injectable({
  providedIn: 'root'
})
export class CriteriaGroupService {

  constructor(private http: HttpClient) { }

  // Headers com Content-Type JSON
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Cadastrar novo projeto (POST)
  createCriterio(criterio: CriteriaGroup, estrategiaId: number): Observable<CriteriaGroup> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups`;
    return this.http.post<CriteriaGroup>(url, criterio, { headers: this.getHeaders() });
  }

  // Buscar todos os grupo de critérios (GET)
  // TODO: Renomear para getAllCriteriaGroups ou getAllGrupoCriterios
  getAllCriterios( estrategiaId: number): Observable<CriteriaGroup[]> {
    const url = `${environment.apiUrl}/strategies/${estrategiaId}/criteria-groups`;
    console.log('URL:', url);
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
