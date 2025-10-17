import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Project, ProjectPageableResponse } from '../interface/interfacies';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) { }

  authService = inject(AuthService);
  private getHeaders(): HttpHeaders {
    return this.authService.getHeaders();
  }

  // Cadastrar novo projeto (POST)
  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project, { headers: this.getHeaders() });
  }

  getProjectsPage( queryParams?: PaginationQueryParams): Observable<Page<any>> {
    return this.http.get<Page<any>>(this.apiUrl, { params: queryParams?.getParamsInHttpParamsFormat() });
  }

  // Buscar todos os projetos (GET)
  getAllProjects(): Observable<ProjectPageableResponse> {
    return this.http.get<ProjectPageableResponse>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Buscar projeto por ID (GET)
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Atualizar projeto (PUT)
  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers: this.getHeaders() });
  }

  // Deletar projeto (DELETE)
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  // Buscar todos os projetos sem paginação (GET /projects/unpaged)
  getProjectsUnpaged(portfolioId?: number, status?: string[]): Observable<Project[]> {
    const params: any = {};
    if (portfolioId !== undefined) params['portfolioId'] = portfolioId;
    if (status && status.length > 0) params['status'] = status;
    return this.http.get<Project[]>(`${this.apiUrl}/unpaged`, { params, headers: this.getHeaders() });
  }
}
