import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AllocationRequestReadDTO,
  AllocationRequestCreateDTO,
  AllocationRequestUpdateDTO,
  AllocationRequestStatusEnum
} from '../interface/allocation-request-interfaces';
import { Page, PaginationQueryParams } from '../models/pagination-models';

@Injectable({
  providedIn: 'root'
})
export class AllocationRequestService {
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  private getAllocationRequestUrl(): string {
    return `${environment.apiUrl}/allocation-requests`;
  }

  constructor(private readonly http: HttpClient) { }

  // CREATE
  create(dto: AllocationRequestCreateDTO): Observable<AllocationRequestReadDTO> {
    return this.http.post<AllocationRequestReadDTO>(this.getAllocationRequestUrl(), dto, { headers: this.getHeaders() });
  }

  // UPDATE
  update(id: number, dto: AllocationRequestUpdateDTO): Observable<AllocationRequestReadDTO> {
    return this.http.put<AllocationRequestReadDTO>(`${this.getAllocationRequestUrl()}/${id}`, dto, { headers: this.getHeaders() });
  }

  // DELETE (disable)
  disable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getAllocationRequestUrl()}/${id}`, { headers: this.getHeaders() });
  }

  // DELETE (hard)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getAllocationRequestUrl()}/${id}/hard-delete`, { headers: this.getHeaders() });
  }

  // READ by ID
  getById(id: number): Observable<AllocationRequestReadDTO> {
    return this.http.get<AllocationRequestReadDTO>(`${this.getAllocationRequestUrl()}/${id}`, { headers: this.getHeaders() });
  }

  // GET paginated
  getAllocationRequestPage(
    queryParams?: PaginationQueryParams,
    searchQuery?: string,
    resourceId?: number,
    projectId?: number,
    status?: string[],
    includeDisabled?: boolean,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
      let params = queryParams?.getParamsInHttpParamsFormat() || new HttpParams();

      // Se status não foi passado, tentar ler do filterButtonQueryParam
      if (!status && queryParams?.filterButtonQueryParam?.name === 'status') {
        status = [queryParams.filterButtonQueryParam.value];
      }

      if (searchQuery !== undefined) params = params.set('searchQuery', searchQuery);
      if (resourceId !== undefined) params = params.set('resourceId', resourceId.toString());
      if (projectId !== undefined) params = params.set('projectId', projectId.toString());
      if (status && status.length > 0) {
        for (const s of status) {
          params = params.append('status', s);
        }
      }
      if (includeDisabled !== undefined) params = params.set('includeDisabled', includeDisabled.toString());
      if (startDate) params = params.set('startDate', startDate);
      if (endDate) params = params.set('endDate', endDate);

      return this.http.get<Page<AllocationRequestReadDTO>>(this.getAllocationRequestUrl(), { params, headers: this.getHeaders() });
  }

  // GET unpaged
  findUnpaged(params?: any): Observable<AllocationRequestReadDTO[]> {
    const url = `${this.getAllocationRequestUrl()}/unpaged`;
    return this.http.get<AllocationRequestReadDTO[]>(url, { params, headers: this.getHeaders() });
  }
}
