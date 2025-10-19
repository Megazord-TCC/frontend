import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,SidebarComponent ,HttpClientModule],
  template: `
     <div class="app-container">
      <app-sidebar
        *ngIf="!isLoginPage()"
        [currentPage]="getCurrentPage()"
        (pageChange)="onPageChange($event)">
      </app-sidebar>
      <div class="main-content" [class.full-width]="isLoginPage()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #f8fafc;
    }
    .main-content {
      flex: 1;
      overflow: auto;
    }
    .main-content.full-width {
      width: 100%;
    }
  `]
})
export class AppComponent {

  constructor(private router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  getCurrentPage(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'dashboard';
    if (url.includes('/portfolios')) return 'portfolios';
    if (url.includes('/portfolio/')) return 'portfolios';
    if (url.includes('/projects')) return 'projects';
    if (url.includes('/strategies')) return 'strategies';
    if (url.includes('/resources')) return 'resources';
    if (url.includes('/users')) return 'users';
    return 'inicio';
  }

  onPageChange(page: string): void {
    this.router.navigate([`/${page}`]);
  }
}
