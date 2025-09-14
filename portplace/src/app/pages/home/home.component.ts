import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { getAuthorizedNavigationCards, NavigationCard } from './navigation-card';
import { AuthService } from '../../service/auth-service';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, SvgIconComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    router = inject(Router);
    authService = inject(AuthService);

    navigationCards: NavigationCard[] = [];

    ngOnInit(): void {
        this.navigationCards = getAuthorizedNavigationCards(this.authService.getAuthorizedPageTypesByRole());
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }
    exitPage() {
        window.location.reload();
    }
}
