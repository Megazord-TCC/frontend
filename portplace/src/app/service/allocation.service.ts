import { Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
  export class AllocationService {
    private getHeaders(): HttpHeaders {
      return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
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
    getAllocationsByDateRange(startDate: string, endDate: string): Observable<DailyAllocationDTO[]> {
      const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
      return this.http.get<DailyAllocationDTO[]>(`${this.getAllocationUrl()}/analytics`, { params, headers: this.getHeaders() });
    }

    // GET paginated
    getAllocationsPage(queryParams?: PaginationQueryParams): Observable<Page<AllocationReadDTO>> {
      const url = this.getAllocationUrl();
      return this.http.get<Page<AllocationReadDTO>>(url, { params: queryParams?.getParamsInHttpParamsFormat() });
    }

    // GET unpaged
    getAllocationsUnpaged(params?: any): Observable<AllocationReadDTO[]> {
      const url = `${this.getAllocationUrl()}/unpaged`;
      return this.http.get<AllocationReadDTO[]>(url, { params, headers: this.getHeaders() });
    }


}
