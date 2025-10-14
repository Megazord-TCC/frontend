import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationResponseDTO, PageType, Role, TokenPayload } from '../interface/carlos-auth-interfaces';
import { decodeToken } from '../helpers/jwt-token-helper';
import { fromRolesDTOToRoles } from '../mappers/auth-mapper';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    token = '';
    tokenPaylod?: TokenPayload;
    name = '';
    roleFrontend?: Role;

    private http = inject(HttpClient);
    private router = inject(Router);

    constructor() {
        if (this.isLocalStorageAcessible()) {
            const userDataStr = localStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                this.token = userData.token;
                this.name = userData.name;
                this.roleFrontend = userData.roleFrontend;
                this.tokenPaylod = userData.tokenPaylod;
            }
            this.checkTokenExpiration();
        }
    }

    private checkTokenExpiration() {
        if (!this.tokenPaylod || !this.tokenPaylod.exp) return;

        const now = Math.floor(Date.now() / 1000);

        if (now >= this.tokenPaylod.exp) this.logout();
        else setTimeout(() => this.checkTokenExpiration(), (this.tokenPaylod.exp - now) * 1000);
    }

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
    }

    private getUsersUrl(): string {
        return `${environment.apiUrl}/users`;
    }

    authenticate(email: string, password: string): Observable<void> {
        return this.http
            .post<AuthenticationResponseDTO>(`${this.getUsersUrl()}/authenticate`, { email, password }, { headers: this.getHeaders() })
            .pipe(
                tap(response => {
                    this.token = response.token;
                    this.tokenPaylod = decodeToken<TokenPayload>(this.token);
                    this.name = this.tokenPaylod?.name ?? '';
                    this.roleFrontend = fromRolesDTOToRoles(this.tokenPaylod?.role);
                    console.log(this.roleFrontend);
                    if (this.isLocalStorageAcessible())
                        localStorage.setItem('userData', JSON.stringify({
                            token: this.token,
                            name: this.name,
                            roleFrontend: this.roleFrontend,
                            tokenPaylod: this.tokenPaylod
                        }));
                }),
                map(_ => undefined)
            );
    }

    logout(): void {
        this.token = '';
        this.tokenPaylod = undefined;
        this.name = '';
        this.roleFrontend = undefined;
        localStorage.removeItem('userData');
        this.router.navigate(['/']);
    }

    getAuthorizedPageTypesByRole(): PageType[] {
        switch (this.roleFrontend) {
            case Role.DIRECTOR:
                return [PageType.DASHBOARD];
            case Role.PMO_ADM:
                return [
                    PageType.HOME,
                    PageType.DASHBOARD,
                    PageType.PORTFOLIOS,
                    PageType.PROJECTS,
                    PageType.STRATEGIES,
                    PageType.RESOURCES,
                    PageType.USERS
                ];
            case Role.PMO:
                return [
                    PageType.HOME,
                    PageType.DASHBOARD,
                    PageType.PORTFOLIOS,
                    PageType.PROJECTS,
                    PageType.STRATEGIES,
                    PageType.RESOURCES
                ];
            case Role.PROJECT_MANAGER:
                return [
                    PageType.HOME,
                    PageType.PROJECTS,
                    PageType.RESOURCES
                ];
            default: return [];
        }
    }

    isTokenValid(): boolean {
        if (!this.tokenPaylod || !this.tokenPaylod.exp) return false;
        const now = Math.floor(Date.now() / 1000);
        return now < this.tokenPaylod.exp;
    }

    isLocalStorageAcessible(): boolean {
        return (typeof window !== 'undefined' && window.localStorage) ? true : false;
    };
}
