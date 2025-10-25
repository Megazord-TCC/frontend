import { Component, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { FormField, FormModalConfig, Project, ProjectStatusEnum } from '../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { TableComponent } from '../../components/table/table.component';
import { ResourcesRequestComponent } from './resources-request/resources-request.component';
import { ResourcesPositionComponent } from './resources-position/resources-position.component';

import { AuthService } from '../../service/auth-service';
import { PageType, Role } from '../../interface/carlos-auth-interfaces';
import { ResourcePoolComponent } from './resources-pool/resources-pool.component';

@Component({
  selector: 'app-resources-page',
  imports: [
    BreadcrumbComponent,
    SvgIconComponent,
    CommonModule,
    FormsModule,
    FormModalComponentComponent,
    BadgeComponent,
    CardComponent,
    TableComponent,
    ResourcesRequestComponent,
    ResourcesPositionComponent,
    ResourcePoolComponent
  ],
  templateUrl: './resources-page.component.html',
  styleUrl: './resources-page.component.scss'
})
export class ResourcesPageComponent implements OnInit {
  authService = inject(AuthService);
  pageType = PageType;
  showCreateModal = false;
  activeFilter = '';
  activeTab = "pedidos";
  loadingResources = false;
  allResources: Project[] = [];
  searchTerm: string = '';
  Resources: Project[] = [];
  isProjectManager = false;
  createResourcesConfig: FormModalConfig = {
    title: 'Cadastrar novo projeto',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome do projeto'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição do projeto',
        rows: 4
      },
      {
        id: 'startDate',
        label: 'Início planejado',
        type: 'date',
        value: '',
        required: true
      },
      {
        id: 'endDate',
        label: 'Fim planejado',
        type: 'date',
        value: '',
        required: true
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Recursos', url: '/recursos', isActive: true }
    ]);
    // Remover breadcrumbs filhos quando retorna para esta página
    this.breadcrumbService.removeChildrenAfter('/recursos');
    this.isProjectManager = this.authService.roleFrontend == Role.PROJECT_MANAGER;

  }

  openCreateModal(): void {
    // Reset form values
    this.createResourcesConfig.fields.forEach(field => {
      field.value = '';
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSaveProject(fields: FormField[]): void {
    // Process form data
    const projectData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    // this.projetoService.createProject(newProject).subscribe({
    //   next: (createdProject) => {
    //     console.log('Projeto criado:', createdProject);
    //     this.loadResources();
    //     this.resetNewProject();
    //   },
    //   error: (err) => {
    //     console.error('Erro ao criar projeto:', err);
    //   }
    // });
    this.closeCreateModal();
  }

  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
    this.applyFilters();
  }
  applyFilters(): void {
    let filtered = [...this.allResources];

    if (this.activeFilter) {
        const filterMap: { [key: string]: ProjectStatusEnum } = {
          'em-analise': ProjectStatusEnum.IN_ANALYSIS,
          'cancelado': ProjectStatusEnum.CANCELLED,
          'em-andamento': ProjectStatusEnum.IN_PROGRESS,
          'finalizado': ProjectStatusEnum.COMPLETED
        };


      filtered = filtered.filter(project =>
        project.status === filterMap[this.activeFilter]
      );
    }

    if (this.searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.Resources = filtered;
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onProjectClick(projectId: number): void {
    this.router.navigate(['/projeto', projectId]);
  }

  getStatusLabel(status: string | ProjectStatusEnum): string {
    if (typeof status === 'string') {
      status = ProjectStatusEnum[status as keyof typeof ProjectStatusEnum];
    }
    switch (status) {
      case ProjectStatusEnum.IN_ANALYSIS:
        return 'EM ANÁLISE';
      case ProjectStatusEnum.CANCELLED:
        return 'CANCELADO';
      case ProjectStatusEnum.IN_PROGRESS:
        return 'EM ANDAMENTO';
      case ProjectStatusEnum.COMPLETED:
        return 'FINALIZADO';
      default:
        return '';
    }
  }

  getStatusColor(status:string | ProjectStatusEnum): string {
    if (typeof status === 'string') {
      status = ProjectStatusEnum[status as keyof typeof ProjectStatusEnum];
    }
     switch (status) {
      case ProjectStatusEnum.IN_ANALYSIS:
        return 'yellow';
      case ProjectStatusEnum.IN_PROGRESS:
        return 'blue';
      case ProjectStatusEnum.COMPLETED:
        return 'green';
      case ProjectStatusEnum.CANCELLED:
        return 'red';
      default:
        return 'gray';
    }
  }
}
