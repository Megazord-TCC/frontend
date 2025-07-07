import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { FormField, FormModalConfig, Project, ProjectStatusEnum } from '../../interface/interfacies';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { ProjetoService } from '../../service/projeto.service';
import { retry } from 'rxjs';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';

@Component({
  selector: 'app-projectspage',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent
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

  newProject: Project = {
    name: '',
    description: '',
    portfolio: undefined  ,
    startDate: '',
    endDate: '',
    status: ProjectStatusEnum.CANDIDATE,
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

  loadProjects(): void {
    this.loadingProjects = true;
    this.projetoService.getAllProjects()
    .pipe(retry(5))
    .subscribe({
      next: (projects) => {
        console.log('Projetos carregados:', projects);
        this.allProjects = projects;
        this.Projects = projects;
        this.loadingProjects = false;
      },
      error: (err) => {
        console.error('Erro ao buscar projetos:', err);
      }
    });
  }

  createProject(): void {
    this.projetoService.createProject(this.newProject).subscribe({
      next: (createdProject) => {
        console.log('Projeto criado:', createdProject);
        this.loadProjects();
        this.resetNewProject();
      },
      error: (err) => {
        console.error('Erro ao criar projeto:', err);
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
        'em-analise': ProjectStatusEnum.CANDIDATE,
        'em-planejamento': ProjectStatusEnum.PLANNING,
        'em-andamento': ProjectStatusEnum.IN_PROGRESS,
        'finalizado': ProjectStatusEnum.FINISHED
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

  onProjectClick(projectId: number): void {
    this.router.navigate(['/projeto', projectId]);
  }

  resetNewProject(): void {
    this.newProject = {
      name: '',
      description: '',
      portfolio: undefined  ,
      startDate: '',
      endDate: '',
      status: ProjectStatusEnum.CANDIDATE,
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

    const newProject: Project = {
      name: projectData.name,
      description: projectData.description,
      portfolio: undefined  ,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      status: ProjectStatusEnum.CANDIDATE,
      projectManager: 1,
      earnedValue: 0,
      plannedValue: 0,
      actualCost: 0,
      budget: 0,
      payback: 0
    };

    this.projetoService.createProject(newProject).subscribe({
      next: (createdProject) => {
        console.log('Projeto criado:', createdProject);
        this.loadProjects();
        this.resetNewProject();
      },
      error: (err) => {
        console.error('Erro ao criar projeto:', err);
      }
    });
    this.closeCreateModal();
  }

  getStatusLabel(status: string |ProjectStatusEnum): string {
    if (typeof status === 'string') {
      status = ProjectStatusEnum[status as keyof typeof ProjectStatusEnum];
    }
    switch (status) {
      case ProjectStatusEnum.CANDIDATE:
        return 'EM ANÁLISE';
      case ProjectStatusEnum.PLANNING:
        return 'EM PLANEJAMENTO';
      case ProjectStatusEnum.IN_PROGRESS:
        return 'EM ANDAMENTO';
      case ProjectStatusEnum.FINISHED:
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
      case ProjectStatusEnum.CANDIDATE:
        return 'yellow';
      case ProjectStatusEnum.PLANNING:
        return 'blue';
      case ProjectStatusEnum.IN_PROGRESS:
        return 'green';
      case ProjectStatusEnum.FINISHED:
        return 'red';
      default:
        return 'gray';
    }
  }

}
