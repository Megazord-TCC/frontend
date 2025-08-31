import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Strategy, StrategyStatusEnum } from '../interface/interfacies';
import { environment } from '../environments/environment';
import { Page } from '../models/pagination-models';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaService {

  private apiUrl = `${environment.apiUrl}/strategies`;

  constructor(private http: HttpClient) { }

  // Headers com Content-Type JSON
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // CREATE - Criar nova estratégia
  createStrategy(strategy: Strategy): Observable<Strategy> {
    return this.http.post<Strategy>(this.apiUrl, strategy, {
      headers: this.getHeaders(),
      observe: 'body'
    });
  }

  // UPDATE - Atualizar estratégia
  updateStrategy(strategyId: number, strategy: Strategy): Observable<Strategy> {
    const url = `${this.apiUrl}/${strategyId}`;
    return this.http.put<Strategy>(url, strategy, {
      headers: this.getHeaders()
    });
  }

  // DELETE - Desabilitar estratégia (soft delete)
  disableStrategy(strategyId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}`;
    return this.http.delete<void>(url, {
      headers: this.getHeaders()
    });
  }

  // DELETE - Deletar estratégia permanentemente (hard delete)
  deleteStrategy(strategyId: number): Observable<void> {
    const url = `${this.apiUrl}/${strategyId}/hard-delete`;
    return this.http.delete<void>(url, {
      headers: this.getHeaders()
    });
  }

  // READ - Buscar todas as estratégias com filtros e paginação
  getStrategies(
    status?: StrategyStatusEnum[],
    searchQuery: string = '',
    includeDisabled: boolean = false,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Observable<Page<Strategy>> {
    let params = new HttpParams()
      .set('searchQuery', searchQuery)
      .set('includeDisabled', includeDisabled.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    // Adicionar status se fornecido
    if (status && status.length > 0) {
      status.forEach(s => {
        params = params.append('status', s);
      });
    }

    return this.http.get<Page<Strategy>>(this.apiUrl, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // READ - Buscar estratégia por ID
  getStrategy(strategyId: number): Observable<Strategy> {
    const url = `${this.apiUrl}/${strategyId}`;
    return this.http.get<Strategy>(url, {
      headers: this.getHeaders()
    });
  }

  // Método legado - manter compatibilidade
  getStrategyById(id: number): Observable<Strategy> {
    return of({
      id: 1,
      name: 'Estratégia 2024',
      activeObjectives: 1,
      status: StrategyStatusEnum.ACTIVE,
      statusColor: 'green'
    });
  }
}
