import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-resources-page',
  imports: [BreadcrumbComponent],
  templateUrl: './resources-page.component.html',
  styleUrl: './resources-page.component.scss'
})
export class ResourcesPageComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Recursos', url: '/recursos', isActive: true }
    ]);

    // Remover breadcrumbs filhos quando retorna para esta página
    this.breadcrumbService.removeChildrenAfter('/recursos');
  }
}
