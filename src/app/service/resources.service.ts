import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { ResourceReadDTO, ResourceCreateDTO, ResourceUpdateDTO } from '../interface/resources-interface';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})


export class ResourcesService {
  constructor(private http: HttpClient) {}

  authService = inject(AuthService);
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();
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
  // UPDATE
  disableResource(resourceId: number): Observable<ResourceReadDTO> {
    return this.http.patch<ResourceReadDTO>(`${this.getResourceUrl()}/${resourceId}/inactivate`, { headers: this.getHeaders() });
  }

  // DELETE (disable)
  deleteNotHardResource(resourceId: number): Observable<void> {
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
  getResourcesPage(
    queryParams?: PaginationQueryParams,
    searchQuery?: string,
    positionId?: number,
    resourceId?: number,
    projectId?: number,
    status?: string[],
    includeDisabled?: boolean,
    startDate?: string,
    endDate?: string
  ): Observable<Page<ResourceReadDTO>> {
    const url = this.getResourceUrl();
    let params = queryParams?.getParamsInHttpParamsFormat() || new HttpParams();

    if (searchQuery !== undefined) params = params.set('searchQuery', searchQuery);
    if (positionId !== undefined) params = params.set('positionId', positionId.toString());
    if (resourceId !== undefined) params = params.set('resourceId', resourceId.toString());
    if (projectId !== undefined) params = params.set('projectId', projectId.toString());
    if (status && status.length > 0) params = params.set('status', status.join(','));
    if (includeDisabled !== undefined) params = params.set('includeDisabled', includeDisabled.toString());
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<Page<ResourceReadDTO>>(url, { params, headers: this.getHeaders() });
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
