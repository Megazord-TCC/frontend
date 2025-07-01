import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPortfolioModalComponent } from '../../../components/edit-portfolio-modal/edit-portfolio-modal.component';
import { RiskModalComponent } from '../../../components/risk-modal/risk-modal.component';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { Project, ProjectStatusEnum } from '../../../interface/interfacies';
import { ProjetoService } from '../../../service/projeto.service';
import { retry } from 'rxjs';

interface Portfolio {
  id: number;
  name?: string;
  description: string;
  status: string;
  lastUpdate: string;
}



interface Risk {
  id: number;
  code: number;
  name: string;
  probability: number;
  impact: number;
  severity: number;
  unresolvedOccurrences: number;
}

interface CommunicationEvent {
  id: number;
  name: string;
  participants: number;
  frequency: string;
}

interface ResponsibleUser {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfoliodetail.component.html',
  styleUrls: ['./portfoliodetail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    EditPortfolioModalComponent,
    RiskModalComponent,
    CardComponent,
    BadgeComponent,
    SvgIconComponent
  ],
  standalone: true
})
export class PortfolioDetailComponent implements OnInit {
  portfolioId!: number;
  portfolio!: Portfolio;
  activeTab = 'resumo';
  activeCommTab = 'plano';
  showEditModal = false;
  showRiskModal = false;
  searchTerm = '';
  loadingProjects = false;
  Projects: Project[] = [];
  allProjects: Project[] = [];
  activeFilter = '';

  editingRisk: Risk | null = null;

  // projects: Project[] = [
  //   {
  //     id: 1,
  //     name: 'Projeto 1',
  //     budget: 'R$ 1.000,00',
  //     ev: 'R$ 10.000,00',
  //     pv: 'R$ 11.000,00',
  //     startDate: '01/01/2025',
  //     endDate: '10/05/2025',
  //     status: 'EM ANDAMENTO'
  //   },
  //   {
  //     id: 2,
  //     name: 'Projeto 2',
  //     budget: 'R$ 1.000,00',
  //     ev: 'R$ 150.000,00',
  //     pv: '130.000,00',
  //     startDate: '03/01/2025',
  //     endDate: '20/06/2025',
  //     status: 'EM ANDAMENTO'
  //   }
  // ];

  risks: Risk[] = [
    {
      id: 1,
      code: 1,
      name: 'Mudança estratégia',
      probability: 1,
      impact: 1,
      severity: 1,
      unresolvedOccurrences: 1
    },
    {
      id: 2,
      code: 2,
      name: 'Escassez de recursos',
      probability: 2,
      impact: 3,
      severity: 6,
      unresolvedOccurrences: 1
    }
  ];

  communicationEvents: CommunicationEvent[] = [
    {
      id: 1,
      name: 'Abertura',
      participants: 3,
      frequency: 'Semanal'
    },
    {
      id: 2,
      name: 'Reunião semanal com diretor',
      participants: 3,
      frequency: 'Semanal'
    }
  ];

  responsibleUsers: ResponsibleUser[] = [
    {
      id: 1,
      name: 'Gabriel Martins'
    },
    {
      id: 2,
      name: 'Guilherme Martins'
    }
  ];

  categories: Category[] = [
    {
      id: 1,
      name: 'Financeiro'
    },
    {
      id: 2,
      name: 'Melhoria de processos'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.portfolioId = +params['id'];
      this.loadPortfolio();
    });
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
  loadPortfolio(): void {
    this.portfolio = {
      id: this.portfolioId,
      name: 'Portfólio 1',
      description: 'Descrição do portfólio 1.',
      status: 'EM ANDAMENTO',
      lastUpdate: 'Última alteração realizada por Carlos Krefer em 01/01/2025 13:30'
    };
  }
  onSearchChange(): void {
    this.applyFilters();
  }


  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
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
  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onCommTabChange(tab: string): void {
    this.activeCommTab = tab;
  }

  onBack(): void {
    this.router.navigate(['/portfolios']);
  }
  openCreateModal(): void {
    this.showEditModal = true;
  }
  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openRiskModal(risk?: Risk): void {
    this.editingRisk = risk || null;
    this.showRiskModal = true;
  }

  closeRiskModal(): void {
    this.showRiskModal = false;
    this.editingRisk = null;
  }

  editPortfolio(): void {
    this.openEditModal();
  }

  deletePortfolio(): void {
    // Implement delete logic here
    console.log('Portfolio deleted');
  }
}
