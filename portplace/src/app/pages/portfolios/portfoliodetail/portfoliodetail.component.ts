import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPortfolioModalComponent } from '../../../components/edit-portfolio-modal/edit-portfolio-modal.component';
import { RiskModalComponent } from '../../../components/risk-modal/risk-modal.component';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { Project, ProjectPageableResponse, ProjectStatusEnum } from '../../../interface/interfacies';
import { ProjetoService } from '../../../service/projeto.service';
import { retry } from 'rxjs';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { PortfolioDetailHeaderComponent } from '../portfolio-detail-header/portfolio-detail-header.component';
import { PortfolioSummaryTabComponent } from '../portfolio-summary-tab/portfolio-summary-tab.component';
import { PortfolioCategoryTabComponent } from '../portfolio-category-tab/portfolio-category-tab.component';
import { PortfolioProjectsTabComponent } from '../portfolio-projects-tab/portfolio-projects-tab.component';

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
    SvgIconComponent,
    PortfolioDetailHeaderComponent,
    PortfolioSummaryTabComponent,
    PortfolioCategoryTabComponent,
    PortfolioProjectsTabComponent
  ],
  standalone: true
})
export class PortfolioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  private projetoService = inject(ProjetoService);

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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.portfolioId = +params['id'];
      this.loadPortfolio();
      this.setupBreadcrumbs();
    });
    this.loadProjects();
  }

  private setupBreadcrumbs(): void {
    // Este é um componente filho, apenas adiciona seu breadcrumb
    // Os breadcrumbs base já foram definidos pelo componente pai (/portfolios)

    // Adicionar o breadcrumb do portfólio atual após carregar
    if (this.portfolio) {
      this.breadcrumbService.addChildBreadcrumb({
        label: this.portfolio.name || `Portfólio ${this.portfolioId}`,
        url: `/portfolio/${this.portfolioId}`,
        isActive: true
      });
    }
  }
  loadProjects(): void {
    this.loadingProjects = true;
    this.projetoService.getAllProjects()
    .pipe(retry(5))
    .subscribe({
      next: (response: ProjectPageableResponse) => {
        console.log('Resposta paginada da API (Portfolio Detail):', response);
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
  loadPortfolio(): void {
    this.portfolio = {
      id: this.portfolioId,
      name: 'Portfólio 1',
      description: 'Descrição do portfólio 1.',
      status: 'EM ANDAMENTO',
      lastUpdate: 'Última alteração realizada por Carlos Krefer em 01/01/2025 13:30'
    };

    // Atualizar breadcrumb após carregar os dados
    this.updateBreadcrumbWithPortfolioName();
  }

  private updateBreadcrumbWithPortfolioName(): void {
    this.breadcrumbService.addChildBreadcrumb({
      label: this.portfolio.name || `Portfólio ${this.portfolioId}`,
      url: `/portfolio/${this.portfolioId}`,
      isActive: true
    });
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
