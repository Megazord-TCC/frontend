import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AllocationReadDTO,
  AllocationCreateDTO,
  AllocationUpdateDTO,
  DailyAllocationDTO
} from '../interface/allocation-interfaces';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
  export class AllocationService {
    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getAllocationUrl(): string {
      return `${environment.apiUrl}/allocations`;
    }

    constructor(private http: HttpClient) {}

    // CREATE
    create(dto: AllocationCreateDTO): Observable<AllocationReadDTO> {
      return this.http.post<AllocationReadDTO>(this.getAllocationUrl(), dto, { headers: this.getHeaders() });
    }

    // UPDATE
    update(allocationId: number, dto: AllocationUpdateDTO): Observable<AllocationReadDTO> {
      return this.http.put<AllocationReadDTO>(`${this.getAllocationUrl()}/${allocationId}`, dto, { headers: this.getHeaders() });
    }

    // DELETE (disable)
    disable(allocationId: number): Observable<void> {
      return this.http.delete<void>(`${this.getAllocationUrl()}/${allocationId}`, { headers: this.getHeaders() });
    }

    // DELETE (hard)
    delete(allocationId: number): Observable<void> {
      return this.http.delete<void>(`${this.getAllocationUrl()}/${allocationId}/hard-delete`, { headers: this.getHeaders() });
    }

    // READ by ID
    getById(allocationId: number): Observable<AllocationReadDTO> {
      return this.http.get<AllocationReadDTO>(`${this.getAllocationUrl()}/${allocationId}`, { headers: this.getHeaders() });
    }

    // GET analytics by date range
    getAllocationsByDateRange(startDate: string, endDate: string, resourceId?: number, projectId?: number): Observable<DailyAllocationDTO[]> {
      let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
      if (resourceId !== undefined) params = params.set('resourceId', resourceId.toString());
      if (projectId !== undefined) params = params.set('projectId', projectId.toString());
      return this.http.get<DailyAllocationDTO[]>(`${this.getAllocationUrl()}/analytics`, { params, headers: this.getHeaders() });
    }

    // GET paginated
    getAllocationsPage(
      queryParams?: PaginationQueryParams,
      searchQuery?: string,
      startDate?: string,
      endDate?: string,
      status?: string[],
      includeDisabled?: boolean,
      resourceId?: number,
      projectId?: number
    ): Observable<Page<AllocationReadDTO>> {
      let params = queryParams?.getParamsInHttpParamsFormat() || new HttpParams();

      // Se statuses não foi passado, tentar ler do filterButtonQueryParam
      if (!status && queryParams?.filterButtonQueryParam?.name === 'status') {
        status = [queryParams.filterButtonQueryParam.value];
      }

      if (startDate) params = params.set('startDate', startDate);
      if (endDate) params = params.set('endDate', endDate);
      if (status && status.length > 0) {
        for (const s of status) {
          params = params.append('status', s);
        }
      }
      if (searchQuery !== undefined) params = params.set('searchQuery', searchQuery);
      if (includeDisabled !== undefined) params = params.set('includeDisabled', includeDisabled.toString());
      if (resourceId !== undefined) params = params.set('resourceId', resourceId.toString());
      if (projectId !== undefined) params = params.set('projectId', projectId.toString());

      return this.http.get<Page<AllocationReadDTO>>(this.getAllocationUrl(), { params, headers: this.getHeaders() });
    }

    // GET unpaged
    getAllocationsUnpaged(params?: any): Observable<AllocationReadDTO[]> {
      const url = `${this.getAllocationUrl()}/unpaged`;
      return this.http.get<AllocationReadDTO[]>(url, { params, headers: this.getHeaders() });
    }


}
