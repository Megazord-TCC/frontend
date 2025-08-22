import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from "../../../components/badge/badge.component";
import { FormsModule } from '@angular/forms';
import { FormField, FormModalConfig, Objectives, Project, ProjectStatusEnum } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { ProjetoService } from '../../../service/projeto.service';
import { retry } from 'rxjs';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';

@Component({
  selector: 'app-project-detailpage',
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent
  ],
  templateUrl: './project-detailpage.component.html',
  styleUrl: './project-detailpage.component.scss'
})
export class ProjectDetailpageComponent implements OnInit {

  project: any = {};

  // Campos editáveis para binding com inputs
  earnedValue: number = 0;
  plannedValue: number = 0;
  actualCost: number = 0;
  budget: number = 0;
  payback: number = 0;

  objectives: Objectives[] = [
    { id: '1', name: 'Nome do objetivo 1' },
    { id: '2', name: 'Nome do objetivo 2' },
    { id: '3', name: 'Nome do objetivo 3' }
  ];

  newProject: Project = {
    name: '',
    description: '',
    portfolio: undefined,
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

  editPortfolioConfig: FormModalConfig = {
    title: 'Editar portfólio',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome do portfólio'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição do portfólio',
        rows: 4
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  cancelProjectConfig: FormModalConfig = {
    title: 'Cancelar projeto',
    fields: [
      {
        id: 'reason',
        label: 'Justificativa do cancelamento',
        type: 'textarea',
        value: '',
        required: true,
        placeholder: 'Digite o motivo do cancelamento...',
        rows: 4
      }
    ],
    validationMessage: 'A justificativa do cancelamento é obrigatória.'
  };

  activeTab = 'indicadores';
  showCancelModal = false;
  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetoService: ProjetoService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    const projectIdParam = this.route.snapshot.paramMap.get('id');
    const projectId = projectIdParam ? Number(projectIdParam) : null;
    if (projectId) {
      this.loadProjectDetails(projectId);
    }
  }

  // Getters para valores calculados
  get cpi(): string {
    if (this.actualCost === 0) return 'N/A';
    const cpi = this.earnedValue / this.actualCost;
    return cpi.toFixed(2);
  }

  get spi(): string {
    if (this.plannedValue === 0) return 'N/A';
    const spi = this.earnedValue / this.plannedValue;
    return spi.toFixed(2);
  }

  get progress(): string {
    if (this.plannedValue === 0) return '0%';
    const progress = (this.earnedValue / this.plannedValue) * 100;
    return `${progress.toFixed(1)}%`;
  }

  get eac(): string {
    if (this.actualCost === 0 || this.budget === 0) return 'N/A';
    const cpi = this.earnedValue / this.actualCost;
    if (cpi === 0) return 'N/A';
    const eac = this.budget / cpi;
    return this.formatCurrency(eac);
  }

  get etc(): string {
    if (this.actualCost === 0 || this.budget === 0) return 'N/A';
    const cpi = this.earnedValue / this.actualCost;
    if (cpi === 0) return 'N/A';
    const eac = this.budget / cpi;
    const etc = eac - this.actualCost;
    return this.formatCurrency(etc);
  }

  // Formatação de moeda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  // Métodos para salvar cada campo individual
  saveEarnedValue(): void {
    this.updateProjectField('earnedValue', this.earnedValue);
  }

  savePlannedValue(): void {
    this.updateProjectField('plannedValue', this.plannedValue);
  }

  saveActualCost(): void {
    this.updateProjectField('actualCost', this.actualCost);
  }

  saveBudget(): void {
    this.updateProjectField('budget', this.budget);
  }

  savePayback(): void {
    this.updateProjectField('payback', this.payback);
  }



  private updateProjectField(fieldName: string, value: number): void {
    // Sanitizar os dados antes de enviar
    const sanitizedProject = this.sanitizeProjectData({
      ...this.project,
      [fieldName]: value
    });


    this.projetoService.updateProject(this.project.id, sanitizedProject)
      .pipe(retry(3))
      .subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
          this.syncFormValues();
        },
        error: (err) => {
          alert('Erro ao salvar. Tente novamente.');
        }
      });
  }

  private sanitizeProjectData(project: any): Project {
    return {
      id: project.id,
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      status: project.status || ProjectStatusEnum.CANDIDATE,
      projectManager: Number(project.projectManager) || 1,
      earnedValue: Number(project.earnedValue) || 0,
      plannedValue: Number(project.plannedValue) || 0,
      actualCost: Number(project.actualCost) || 0,
      budget: Number(project.budget) || 0,
      payback: Number(project.payback) || 0,
      // Remover campos que podem causar problemas
      ...(project.portfolio && { portfolio: project.portfolio }),
      ...(project.cancellationReason && { cancellationReason: project.cancellationReason })
    };
  }

  private syncFormValues(): void {
    this.earnedValue = this.project.earnedValue || 0;
    this.plannedValue = this.project.plannedValue || 0;
    this.actualCost = this.project.actualCost || 0;
    this.budget = this.project.budget || 0;
    this.payback = this.project.payback || 0;
  }

  loadProjectDetails(projectId: number): void {
    this.projetoService.getProjectById(projectId)
      .pipe(retry(5))
      .subscribe({
        next: (project) => {
          console.log('Detalhes do projeto:', project);
          this.project = project;
          this.syncFormValues();
          this.breadcrumbService.addChildBreadcrumb({
            label: project.name || `Projeto ${projectId}`,
            url: `/projetos/${projectId}`,
            isActive: true
          });
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do projeto:', err);
          this.router.navigate(['/projects']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/projetos']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  resetNewProject(): void {
    this.newProject = {
      name: '',
      description: '',
      portfolio: undefined,
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

  openEditModal(): void {
    this.editPortfolioConfig.fields[0].value = this.project.name;
    this.editPortfolioConfig.fields[1].value = this.project.description || '';

    this.editPortfolioConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onSavePortfolio(fields: FormField[]): void {
    const projectData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    const updatedProject = {
      ...this.project,
      name: projectData.name,
      description: projectData.description
    };

    const sanitizedProject = this.sanitizeProjectData(updatedProject);

    console.log('Dados do projeto a serem atualizados:', sanitizedProject);

    this.projetoService.updateProject(this.project.id, sanitizedProject)
      .pipe(retry(5))
      .subscribe({
        next: (createdProject) => {
          console.log('Projeto alterado:', createdProject);
          this.loadProjectDetails(this.project.id);
          this.resetNewProject();
        },
        error: (err) => {
          console.error('Erro ao alterar projeto:', err);
          console.error('Detalhes do erro:', err.error);
        }
      });

    this.closeEditModal();
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  openCancelModal(): void {
    this.cancelProjectConfig.fields[0].value = '';
    this.cancelProjectConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCancelModal = true;
  }

  onCancelProject(fields: FormField[]): void {
    const cancelReason = fields.find(f => f.id === 'reason')?.value || '';

    const cancelData = {
      projectId: this.project.id,
      reason: cancelReason,
      status: ProjectStatusEnum.FINISHED,
      cancelledDate: new Date().toISOString()
    };

    console.log('Cancelando projeto:', cancelData);

    const updatedProject = {
      ...this.project,
      status: ProjectStatusEnum.FINISHED,
      cancellationReason: cancelReason
    };

    const sanitizedProject = this.sanitizeProjectData(updatedProject);

    this.projetoService.updateProject(this.project.id, sanitizedProject)
    .pipe(retry(3))
    .subscribe({
      next: (updatedProject) => {
        console.log('Projeto cancelado com sucesso:', updatedProject);
        this.closeCancelModal();
        this.loadProjectDetails(this.project.id);
        alert('Projeto cancelado com sucesso');
        setTimeout(() => {
          this.router.navigate(['/projetos']);
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao cancelar projeto:', err);
        console.error('Detalhes do erro:', err.error);
        alert('Erro ao cancelar o projeto. Tente novamente.');
      }
    });
  }
}
