import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Page, PaginationQueryParams } from '../models/pagination-models';
import { ScenarioService } from './scenario-service';
import { UserGetResponseDTO, UserStatusEnumDTO } from '../interface/carlos-user-interfaces';
import { RoleDTO } from '../interface/carlos-auth-interfaces';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    http = inject(HttpClient);
    scenarioService = inject(ScenarioService);

    authService = inject(AuthService);
    private getHeaders(): HttpHeaders {
      return this.authService.getHeaders();
    }

    private getUserUrl(): string {
        return `${environment.apiUrl}/users`;
    }

    // GET - Buscar usuário por id
    getUserById(userId: number): Observable<UserGetResponseDTO> {
        return this.http.get<UserGetResponseDTO>(`${this.getUserUrl()}/${userId}`);
    }

    // GET - Buscar todos os usuários
    getUsersPage(queryParams?: PaginationQueryParams): Observable<Page<UserGetResponseDTO>> {
        const params = PaginationQueryParams.sortByThisIfNotSortedYet('name', queryParams).getParamsInHttpParamsFormat();

        return this.http.get<Page<UserGetResponseDTO>>(this.getUserUrl(), { params });
    }

    // POST - Criar um novo usuário
    createUser(name: string, email: string, password: string, role: RoleDTO, status: UserStatusEnumDTO): Observable<any> {
        const url = `${this.getUserUrl()}/register`;
        const body = { name, email, password, role };

        return this.http.post(url, body, { headers: this.getHeaders() });
    }

    // UPDATE - Editar um usuário
    editUser(userId: number, name: string, password: string, role: RoleDTO, status: UserStatusEnumDTO): Observable<any> {
        const url = `${this.getUserUrl()}/${userId}`;
        const body = { name, password, role, status };

        return this.http.put(url, body, { headers: this.getHeaders() });
    }
}
