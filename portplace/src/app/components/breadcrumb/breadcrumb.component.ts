import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbItem } from '../../interface/interfacies';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navega para uma URL específica via breadcrumb
   * e trunca os breadcrumbs até o índice clicado
   */
  onBreadcrumbClick(index: number): void {
    const breadcrumb = this.breadcrumbs[index];
    if (breadcrumb && !breadcrumb.isActive) {
      // Truncar breadcrumbs primeiro
      this.breadcrumbService.truncateBreadcrumbs(index);

      // Navegar para a URL
      this.router.navigate([breadcrumb.url]);
    }
  }
}
