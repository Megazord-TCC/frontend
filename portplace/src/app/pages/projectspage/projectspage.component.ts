import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { FormField, FormModalConfig, Project, ProjectPageableResponse, ProjectStatusEnum, ApiError, ValidationError } from '../../interface/interfacies';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { ProjetoService } from '../../service/projeto.service';
import { map, Observable, retry } from 'rxjs';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { TableComponent } from '../../components/table/table.component';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './projects-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { mapProjectPageDtoToProjectTableRowPage } from "../../mappers/projects-mappers"

@Component({
  selector: 'app-projectspage',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    TableComponent
  ],
  templateUrl: './projectspage.component.html',
  styleUrl: './projectspage.component.scss'
})
export class ProjectsComponent implements OnInit {
  showCreateModal = false;
  loadingProjects = false;
  Projects: Project[] = [];
  allProjects: Project[] = [];
  searchTerm = '';
  activeFilter = '';

  filterButtons = getFilterButtons();
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();


  newProject: Project = {
    name: '',
    description: '',
    portfolio: undefined  ,
    startDate: '',
    endDate: '',
    status: ProjectStatusEnum.IN_ANALYSIS,
    projectManager: 1,
    earnedValue: 0,
    plannedValue: 0,
    actualCost: 0,
    budget: 0,
    payback: 0
  };

  createProjectConfig: FormModalConfig = {
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
    private router: Router,
    private projetoService: ProjetoService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Projetos', url: '/projetos', isActive: true }
    ]);

    // Remover breadcrumbs filhos quando retorna para esta página
    this.breadcrumbService.removeChildrenAfter('/projetos');

    this.loadProjects();
  }

  // Usado pelo TableComponent.
  // Recarrega a tabela de projetos, buscando os dados via requisição HTTP.
  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
    this.projetoService.getProjectsPage(queryParams).pipe(
      map(page => mapProjectPageDtoToProjectTableRowPage(page))
    )
  );

  loadProjects(): void {
    this.loadingProjects = true;
    this.projetoService.getAllProjects()
    .pipe(retry(5))
    .subscribe({
      next: (response: ProjectPageableResponse) => {
        console.log('Resposta paginada da API:', response);
        console.log(`Total de elementos: ${response.totalElements}`);
        console.log(`Página atual: ${response.number + 1} de ${response.totalPages}`);

        // Extrair projetos da resposta paginada
        this.allProjects = response.content;
        this.Projects = response.content;
        this.loadingProjects = false;
      },
      error: (err) => {
        console.error('Erro ao buscar projetos:', err);
        this.allProjects = [];
        this.Projects = [];
        this.loadingProjects = false;
      }
    });
  }

  createProject(): void {
    console.log('Dados do projeto sendo enviados:', this.newProject);

    this.projetoService.createProject(this.newProject).subscribe({
      next: (createdProject) => {
        console.log('Projeto criado:', createdProject);
        this.loadProjects();
        this.resetNewProject();
      },
      error: (err) => {
        console.error('Erro completo ao criar projeto:', err);
        this.handleApiError(err);
      }
    });
  }

  updateProject(project: Project): void {
    if (!project.id) {
      console.error('ID do projeto não encontrado!');
      return;
    }
    this.projetoService.updateProject(project.id, project).subscribe({
      next: (updatedProject) => {
        console.log('Projeto atualizado:', updatedProject);
        this.loadProjects();
      },
      error: (err) => {
        console.error('Erro ao atualizar projeto:', err);
      }
    });
  }

  deleteProject(projectId: number): void {
    this.projetoService.deleteProject(projectId).subscribe({
      next: () => {
        console.log('Projeto deletado!');
        this.loadProjects();
      },
      error: (err) => {
        console.error('Erro ao deletar projeto:', err);
      }
    });
  }

  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allProjects];

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

    this.Projects = filtered;
  }

  onProjectClick(projectOrId: any): void {
    const id = typeof projectOrId === 'object' && projectOrId !== null ? projectOrId.id : projectOrId;
    if (id) {
      this.router.navigate(['/projeto', id]);
    } else {
      console.warn('ID do projeto não encontrado:', projectOrId);
    }
  }

  resetNewProject(): void {
    this.newProject = {
      name: '',
      description: '',
      portfolio: undefined  ,
      startDate: '',
      endDate: '',
      status: ProjectStatusEnum.IN_ANALYSIS,
      projectManager: 1,
      earnedValue: 0,
      plannedValue: 0,
      actualCost: 0,
      budget: 0,
      payback: 0
    };
  }

  openCreateModal(): void {
    // Reset form values
    this.createProjectConfig.fields.forEach(field => {
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

    // Validar dados antes de enviar
    const validationResult = this.validateProjectData(projectData);
    if (!validationResult.isValid) {
      console.error('Dados inválidos:', validationResult.errors);
      // Aqui você pode mostrar os erros no formulário
      return;
    }

    const newProject: Project = {
      name: projectData.name,
      description: projectData.description,
      portfolio: undefined,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      status: ProjectStatusEnum.IN_ANALYSIS,
      projectManager: 1,
      earnedValue: 0,
      plannedValue: 0,
      actualCost: 0,
      budget: 0,
      payback: 0
    };

    console.log('Dados do projeto sendo enviados:', newProject);

    this.projetoService.createProject(newProject).subscribe({
      next: (createdProject) => {
        console.log('Projeto criado:', createdProject);
        this.loadProjects();
        this.resetNewProject();
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Erro completo ao criar projeto:', err);

        this.handleApiError(err);

        // Manter o modal aberto para que o usuário possa corrigir
        // this.closeCreateModal(); // Remover esta linha para não fechar o modal
      }
    });
  }

  private validateProjectData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar nome
    if (!data.name || data.name.trim() === '') {
      errors.push('Nome é obrigatório');
    }

    // Validar datas
    if (!data.startDate) {
      errors.push('Data de início é obrigatória');
    }

    if (!data.endDate) {
      errors.push('Data de fim é obrigatória');
    }

    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate >= endDate) {
        errors.push('Data de fim deve ser posterior à data de início');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private handleApiError(err: any): void {
    console.error('Detalhes do erro:', {
      status: err.status,
      statusText: err.statusText,
      url: err.url
    });

    if (err.error) {
      const apiError = err.error as ApiError;
      console.error('Erro da API:', {
        status: apiError.status || err.status,
        message: apiError.message,
        path: apiError.path,
        method: apiError.method,
        timestamp: apiError.timestamp
      });

      // Se houver erros de validação específicos, exiba-os
      if (apiError.errors && Array.isArray(apiError.errors)) {
        console.error('Erros de validação específicos:');
        apiError.errors.forEach((error: ValidationError, index: number) => {
          console.error(`Erro ${index + 1}:`, {
            campo: error.field,
            valorRejeitado: error.rejectedValue,
            mensagem: error.defaultMessage,
            codigo: error.code,
            objeto: error.objectName
          });
        });
      }
    }
  }

  getStatusLabel(status: string |ProjectStatusEnum): string {
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
