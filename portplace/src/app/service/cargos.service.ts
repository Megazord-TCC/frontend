import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { PositionReadDTO, PositionCreateDTO, PositionUpdateDTO } from '../interface/cargos-interfaces';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class CargosService {
  constructor(private http: HttpClient) {}

  authService = inject(AuthService);
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();
  }

  private getPositionUrl(): string {
    return `${environment.apiUrl}/positions`;
  }

  // CREATE
  createPosition(dto: PositionCreateDTO): Observable<PositionReadDTO> {
    return this.http.post<PositionReadDTO>(this.getPositionUrl(), dto, { headers: this.getHeaders() });
  }

  // UPDATE
  updatePosition(positionId: number, dto: PositionUpdateDTO): Observable<PositionReadDTO> {
    return this.http.put<PositionReadDTO>(`${this.getPositionUrl()}/${positionId}`, dto, { headers: this.getHeaders() });
  }

  // DELETE (disable)
  disablePosition(positionId: number): Observable<void> {
    return this.http.delete<void>(`${this.getPositionUrl()}/${positionId}`, { headers: this.getHeaders() });
  }

  // DELETE (hard)
  deletePosition(positionId: number): Observable<void> {
    return this.http.delete<void>(`${this.getPositionUrl()}/${positionId}/hard-delete`, { headers: this.getHeaders() });
  }

  // READ by ID
  getPositionById(positionId: number): Observable<PositionReadDTO> {
    return this.http.get<PositionReadDTO>(`${this.getPositionUrl()}/${positionId}`, { headers: this.getHeaders() });
  }

  // GET paginated
  getPositionsPage(queryParams?: PaginationQueryParams): Observable<Page<PositionReadDTO>> {
    const url = this.getPositionUrl();
    queryParams = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams);
    return this.http.get<Page<PositionReadDTO>>(url, { params: queryParams?.getParamsInHttpParamsFormat(), headers: this.getHeaders() });
  }

  // GET unpaged
  getPositionsUnpaged(params?: any): Observable<PositionReadDTO[]> {
    const url = `${this.getPositionUrl()}/unpaged`;
    return this.http.get<PositionReadDTO[]>(url, { params, headers: this.getHeaders() });
  }
}
