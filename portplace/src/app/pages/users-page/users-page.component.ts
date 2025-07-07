import { Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-users-page',
  imports: [BreadcrumbComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Usuários', url: '/usuarios', isActive: true }
    ]);

    // Remover breadcrumbs filhos quando retorna para esta página
    this.breadcrumbService.removeChildrenAfter('/usuarios');
  }
}
