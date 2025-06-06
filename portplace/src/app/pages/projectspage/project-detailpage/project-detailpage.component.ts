import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from "../../../components/badge/badge.component";
import { FormsModule } from '@angular/forms';
import { Evaluation, FormField, FormModalConfig, Indicator, Objective, Objectives, Project, ProjectStatusEnum } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { ProjetoService } from '../../../service/projeto.service';
import { retry } from 'rxjs';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';



@Component({
  selector: 'app-project-detailpage',
  imports: [
    CommonModule,
    FormsModule,
    BadgeComponent,
    SvgIconComponent,
    FormModalComponentComponent
  ],
  templateUrl: './project-detailpage.component.html',
  styleUrl: './project-detailpage.component.scss'
})
export class ProjectDetailpageComponent implements OnInit {
  showEditModal = false;
  project: any = {
    id: '1',
    name: 'Projeto 1',
    status: 'EM ANÁLISE',
    statusColor: 'yellow',
    description: 'Descrição do projeto 1.',
    startDate: '01/01/2000',
    endDate: '02/01/2000',
    lastUpdate: 'Última alteração realizada por Carlos Krefer em 01/01/2025 13:30.'
  };

  indicators: Indicator[] = [
    {
      id: '1',
      label: 'Valor Agregado (EV)',
      value: 'R$ 1.600.000,00',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '2',
      label: 'Valor Planejado (PV)',
      value: 'R$ 1.600.000,00',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '3',
      label: 'Retorno no Investimento (ROI)',
      value: '3',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '4',
      label: 'Valor Presente Líquido (VPL)',
      value: '3',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '5',
      label: 'Payback (anos)',
      value: '3',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '6',
      label: 'Índice de Performance de Custo (CPI)',
      value: '3',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '7',
      label: 'Índice de Desemp. de Cronograma (SPI)',
      value: '3',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    },
    {
      id: '8',
      label: 'Estimativa de Conclusão (ETC)',
      value: 'R$ 10,00',
      lastUpdate: 'Última alteração realizada em 01/01/2025 13:30'
    }
  ];

  objectives: Objectives[] = [
    { id: '1', name: 'Nome do objetivo 1' },
    { id: '2', name: 'Nome do objetivo 2' },
    { id: '3', name: 'Nome do objetivo 3' }
  ];

  evaluations: Evaluation[] = [
    { id: '1', name: 'Nome do critério 1', weight: 30, value: 700 },
    { id: '2', name: 'Nome do critério 2', weight: 20, value: 700 },
    { id: '3', name: 'Nome do critério 3', weight: 50, value: 700 }
  ];
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
  Projects: Project[] = [];
  allProjects: Project[] =[];
  activeTab = 'indicadores';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    const projectIdParam = this.route.snapshot.paramMap.get('id');
    const projectId = projectIdParam ? Number(projectIdParam) : null;
    if (projectId) {
      this.loadProjectDetails(projectId);
    }

  }



  loadProjectDetails(projectId: number): void {
    this.projetoService.getProjectById(projectId)
      .pipe(retry(5))
      .subscribe({
        next: (project) => {
          console.log('Detalhes do projeto:', project);
          this.project = project;
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do projeto:', err);
          this.router.navigate(['/projects']);
        }
      });
  }


  goBack(): void {
    this.router.navigate(['/projects']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  saveIndicator(indicator: Indicator): void {
    console.log('Saving indicator:', indicator);
    // Implement save logic here
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
  openEditModal(): void {
    // Populate form with existing data
    this.editPortfolioConfig.fields[0].value = this.project.name;
    this.editPortfolioConfig.fields[1].value = this.project.description || '';

    // Reset validation
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


    const newProject: Project = {
      id: this.project.id,
      name: projectData.name,
      description: projectData.description,
      status: this.project.status || '',
      earnedValue: this.project.earnedValue || '',
      plannedValue: this.project.plannedValue || '',
      actualCost: this.project.actualCost || '',
      budget: this.project.budget || '',
      payback: this.project.payback,
      startDate: this.project.startDate || '',
      endDate: this.project.endDate || '',
      projectManager: this.project.projectManager || 1
    };
    console.log('Dados do projeto a serem atualizados:', newProject);
    this.projetoService.updateProject(this.project.id, newProject)
     .pipe(retry(5))
     .subscribe({
      next: (createdProject) => {
        console.log('Projeto alterado:', createdProject);
        this.loadProjectDetails(this.project.id);
        this.resetNewProject();
      },
      error: (err) => {
        console.error('Erro ao alterar projeto:', err);
      }
    });

    this.closeEditModal();
  }
}
