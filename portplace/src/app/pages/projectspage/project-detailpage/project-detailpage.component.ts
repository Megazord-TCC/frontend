import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from "../../../components/badge/badge.component";
import { FormsModule } from '@angular/forms';
import { FormField, FormModalConfig, Objectives, Project, ProjectStatusEnum } from '../../../interface/interfacies';
import { mapProjectDtoToProject } from '../../../mappers/projects-mappers';
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
  formTouched = false;
  project: Project | null = null;

 
  earnedValue: number = 0;
  plannedValue: number = 0;
  actualCost: number = 0;
  budgetAtCompletion: number = 0;
  payback: number = 0;
  roi: number = 0;
  startDate: string = '';
  endDate: string = '';

  objectives: Objectives[] = [
    { id: '1', name: 'Nome do objetivo 1' },
    { id: '2', name: 'Nome do objetivo 2' },
    { id: '3', name: 'Nome do objetivo 3' }
  ];

  newProject: Project = {
    id: 0,
    name: '',
    description: '',
    status: ProjectStatusEnum.IN_ANALYSIS,
    payback: 0,
    roi: 0,
    startDate: '',
    endDate: '',
    plannedValue: 0,
    earnedValue: 0,
    actualCost: 0,
    budgetAtCompletion: 0,
    percentComplete: 0,
    costPerformanceIndex: 0,
    schedulePerformanceIndex: 0,
    estimateAtCompletion: 0,
    estimateToComplete: 0,
    portfolioCategory: undefined,
    portfolioName: '',
    strategyName: '',
    scenarioRankingScore: 0,
    priorityInPortfolio: 0,
    strategicObjectives: [],
    evaluations: [],
    createdAt: '',
    lastModifiedAt: '',
    disabled: false
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

  get cpi(): string {
    if (!this.project || this.project.actualCost === 0) return 'N/A';
    const cpi = this.project.earnedValue / this.project.actualCost;
    return cpi.toFixed(2);
  }

  get spi(): string {
    if (!this.project || this.project.plannedValue === 0) return 'N/A';
    const spi = this.project.earnedValue / this.project.plannedValue;
    return spi.toFixed(2);
  }

  get progress(): string {
    if (!this.project || this.project.plannedValue === 0) return '0%';
    const progress = (this.project.earnedValue / this.project.plannedValue) * 100;
    return `${progress.toFixed(1)}%`;
  }

  get eac(): string {
    if (!this.project || this.project.actualCost === 0 || this.project.budgetAtCompletion === 0) return 'N/A';
    const cpi = this.project.earnedValue / this.project.actualCost;
    if (cpi === 0) return 'N/A';
    const eac = this.project.budgetAtCompletion / cpi;
    return this.formatCurrency(eac);
  }

  get etc(): string {
    if (!this.project || this.project.actualCost === 0 || this.project.budgetAtCompletion === 0) return 'N/A';
    const cpi = this.project.earnedValue / this.project.actualCost;
    if (cpi === 0) return 'N/A';
    const eac = this.project.budgetAtCompletion / cpi;
    const etc = eac - this.project.actualCost;
    return this.formatCurrency(etc);
  }

  // Formatação de moeda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }


  onInputChange(): void {
    this.formTouched = true;
  }

  onSaveProjeto(): void {
    if (!this.project) return;
    // Função utilitária para formatar data dd/MM/yyyy
    function formatDateBR(dateStr?: string): string {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // já está formatada
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const updatedProject = {
      name: this.project.name,
      description: this.project.description,
      status: this.project.status,
      earnedValue: this.earnedValue,
      plannedValue: this.plannedValue,
      actualCost: this.actualCost,
      budgetAtCompletion: this.budgetAtCompletion,
      payback: this.payback,
      startDate: formatDateBR(this.project.startDate),
      endDate: formatDateBR(this.project.endDate)
    };

    this.projetoService.updateProject(this.project.id, updatedProject)
      .pipe(retry(5))
      .subscribe({
        next: (createdProject) => {
          this.project = createdProject;
          this.syncFormValues();
          this.formTouched = false;
        },
        error: (err) => {
          console.error('Erro ao alterar projeto:', err);
        }
      });
  }



  private updateProjectField(fieldName: keyof Project, value: any): void {
    if (!this.project) return;
    const sanitizedProject = { ...this.project, [fieldName]: value };
    this.projetoService.updateProject(this.project.id, sanitizedProject)
      .pipe(retry(3))
      .subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
        },
        error: (err) => {
          alert('Erro ao salvar. Tente novamente.');
        }
      });
  }

  private syncFormValues(): void {
    if (!this.project) return;
    this.earnedValue = this.project.earnedValue || 0;
    this.plannedValue = this.project.plannedValue || 0;
    this.actualCost = this.project.actualCost || 0;
    this.budgetAtCompletion = this.project.budgetAtCompletion || 0;
    this.payback = this.project.payback || 0;
    this.roi = this.project.roi || 0;
    this.startDate = this.project.startDate || '';
    this.endDate = this.project.endDate || '';
  }

  loadProjectDetails(projectId: number): void {
    this.projetoService.getProjectById(projectId)
      .pipe(retry(5))
      .subscribe({
        next: (projectDto) => {
          const project = mapProjectDtoToProject(projectDto);
          // Aplica a cor do status
          (project as any).statusColor = this.getProjectStatusColor(project.status);
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
      id: 0,
      name: '',
      description: '',
      status: ProjectStatusEnum.IN_ANALYSIS,
      payback: 0,
      roi: 0,
      startDate: '',
      endDate: '',
      plannedValue: 0,
      earnedValue: 0,
      actualCost: 0,
      budgetAtCompletion: 0,
      percentComplete: 0,
      costPerformanceIndex: 0,
      schedulePerformanceIndex: 0,
      estimateAtCompletion: 0,
      estimateToComplete: 0,
      portfolioCategory: undefined,
      portfolioName: '',
      strategyName: '',
      scenarioRankingScore: 0,
      priorityInPortfolio: 0,
      strategicObjectives: [],
      evaluations: [],
      createdAt: '',
      lastModifiedAt: '',
      disabled: false
    };
  }

  openEditModal(): void {
    if (!this.project) return;
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

  // onSavePortfolio removido, agora é onSaveProjeto

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
    if (!this.project) return;
    const cancelReason = fields.find(f => f.id === 'reason')?.value || '';

    const updatedProject = {
      ...this.project,
      status: ProjectStatusEnum.CANCELLED,
      cancellationReason: cancelReason
    };

    this.projetoService.updateProject(this.project.id, updatedProject)
    .pipe(retry(3))
    .subscribe({
      next: (updatedProject) => {
        console.log('Projeto cancelado com sucesso:', updatedProject);
        this.closeCancelModal();
        this.loadProjectDetails(this.project!.id);
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


  getProjectStatusColor(status: string): string {
    switch (status) {
      case 'IN_ANALYSIS':
        return 'yellow';
      case 'IN_PROGRESS':
        return 'green';
      case 'COMPLETED':
        return 'blue';
      case 'CANCELLED':
        return 'gray';
      default:
        return 'gray';
    }
  }
}
