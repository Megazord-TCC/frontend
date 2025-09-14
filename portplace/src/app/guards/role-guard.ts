import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { PageType } from '../interface/carlos-auth-interfaces';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Confere qual o tipo de página atual (configurado no app.routes.ts)
        const currentPageType = route.data['pageType'] as PageType;

        if (currentPageType == PageType.LOGIN) return true;

        const authorizedPageTypes = this.authService.getAuthorizedPageTypesByRole();

        if (authorizedPageTypes.includes(currentPageType)) return true;

        let isNotLoggedIn = !this.authService.token;

        if (isNotLoggedIn) this.router.navigate(['/']);
        else if (authorizedPageTypes.length == 1) this.router.navigate(['/dashboard']);
        else this.router.navigate(['/inicio']);

        return false;
    }
}
