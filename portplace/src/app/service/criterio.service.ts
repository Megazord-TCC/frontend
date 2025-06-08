import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Criterion } from '../interface/interfacies';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {

  private apiUrl = `${environment.apiUrl}/Criterios`;

  constructor(private http: HttpClient) { }

  // Headers com Content-Type JSON
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Cadastrar novo projeto (POST)
  createCriterio(criterio: Criterion): Observable<Criterion> {
    return this.http.post<Criterion>(this.apiUrl, criterio, { headers: this.getHeaders() });
  }

  // Buscar todos os projetos (GET)
  getAllCriterios(): Observable<Criterion[]> {
    return this.http.get<Criterion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Buscar projeto por ID (GET)
  getCriterioById(id: number): Observable<Criterion> {
    return this.http.get<Criterion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Atualizar projeto (PUT)
  updateCriterio(id: number, Criterio: Criterion): Observable<Criterion> {
    return this.http.put<Criterion>(`${this.apiUrl}/${id}`, Criterio, { headers: this.getHeaders() });
  }

  // Deletar projeto (DELETE)
  deleteCriterio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
