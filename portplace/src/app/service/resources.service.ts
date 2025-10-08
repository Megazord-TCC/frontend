import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { ResourceReadDTO, ResourceCreateDTO, ResourceUpdateDTO } from '../interface/resources-interface';

@Injectable({
  providedIn: 'root'
})


export class ResourcesService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
  }

  private getResourceUrl(): string {
    return `${environment.apiUrl}/resources`;
  }

  // CREATE
  createResource(dto: ResourceCreateDTO): Observable<ResourceReadDTO> {
    return this.http.post<ResourceReadDTO>(this.getResourceUrl(), dto, { headers: this.getHeaders() });
  }

  // UPDATE
  updateResource(resourceId: number, dto: ResourceUpdateDTO): Observable<ResourceReadDTO> {
    return this.http.put<ResourceReadDTO>(`${this.getResourceUrl()}/${resourceId}`, dto, { headers: this.getHeaders() });
  }

  // DELETE (disable)
  disableResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.getResourceUrl()}/${resourceId}`, { headers: this.getHeaders() });
  }

  // DELETE (hard)
  deleteResource(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${this.getResourceUrl()}/${resourceId}/hard-delete`, { headers: this.getHeaders() });
  }

  // READ by ID
  getResourceById(resourceId: number): Observable<ResourceReadDTO> {
    return this.http.get<ResourceReadDTO>(`${this.getResourceUrl()}/${resourceId}`, { headers: this.getHeaders() });
  }

  // GET paginated
  getResourcesPage(queryParams?: PaginationQueryParams, startDate?: string, endDate?: string, status?: string | string[]): Observable<Page<ResourceReadDTO>> {
    const url = this.getResourceUrl();
    const params: { [key: string]: any } = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    // Sempre converte status para string separada por vírgula
    let statusParam = params['status'] ?? status;
    if (Array.isArray(statusParam)) {
      statusParam = statusParam.join(',');
    }
    if (!statusParam || statusParam === '') {
      statusParam = 'ACTIVE,INACTIVE';
    }
    params['status'] = statusParam;
    console.log('Fetching resources with params:', params);
    return this.http.get<Page<ResourceReadDTO>>(url, { params: params, headers: this.getHeaders() });
  }

  // GET paginated with available hours (startDate, endDate)
  getResourcesWithAvailableHours(queryParams: any): Observable<Page<ResourceReadDTO>> {
    const url = this.getResourceUrl();
    return this.http.get<Page<ResourceReadDTO>>(url, { params: queryParams, headers: this.getHeaders() });
  }

  // GET unpaged
  getResourcesUnpaged(params?: any): Observable<ResourceReadDTO[]> {
    const url = `${this.getResourceUrl()}/unpaged`;
    return this.http.get<ResourceReadDTO[]>(url, { params, headers: this.getHeaders() });
  }
}
