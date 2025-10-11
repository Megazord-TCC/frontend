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
import { PaginationQueryParams } from '../models/pagination-models';

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
  findById(id: number): Observable<AllocationRequestReadDTO> {
    return this.http.get<AllocationRequestReadDTO>(`${this.getAllocationRequestUrl()}/${id}`, { headers: this.getHeaders() });
  }

  // GET paginated
  getAllocationRequestPage(queryParams?: PaginationQueryParams, status?: AllocationRequestStatusEnum[]): Observable<any> {
    const params: { [key: string]: any } = {};
    if (status && status.length > 0) params['status'] = status;
    return this.http.get<any>(this.getAllocationRequestUrl(), { params: params, headers: this.getHeaders() });
  }

  // GET unpaged
  findUnpaged(params?: any): Observable<AllocationRequestReadDTO[]> {
    const url = `${this.getAllocationRequestUrl()}/unpaged`;
    return this.http.get<AllocationRequestReadDTO[]>(url, { params, headers: this.getHeaders() });
  }
}
