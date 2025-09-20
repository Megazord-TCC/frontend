import { StrategiaObjetivoService } from '../../service/strategia-objetivo.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ProgressComponent } from '../../components/progress/progress.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Router } from '@angular/router';
import { Risk, MetricCard, Objective } from '../../interface/interfacies';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../service/auth-service';
import { PageType } from '../../interface/carlos-auth-interfaces';
import { Page } from '../../models/pagination-models';
import { PortfolioService } from '../../service/portfolio-service';
import { ProjectReadDTO2 } from '../../interface/carlos-project-dtos';
import { PortfolioListReadDTO, PortfolioReadDTO } from '../../interface/carlos-portfolio-interfaces';
import { PaginationQueryParams } from '../../models/pagination-models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ProgressComponent,
    BadgeComponent,
    SvgIconComponent
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private objetivoService = inject(StrategiaObjetivoService);
  objetivos: Objective[] = [];
  @ViewChild('costChart', { static: false }) costChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectBubbleChart', { static: false }) projectBubbleChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('riskBubbleChart', { static: false }) riskBubbleChartRef!: ElementRef<HTMLCanvasElement>;

  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private portfolioService = inject(PortfolioService);
  authService = inject(AuthService);
  costChart: any;
  projectBubbleChart: any;
  riskBubbleChart: any;
  pageType = PageType;

  hasPortfolio = true;
  expandedSections: string[] = [];
  selectedPortfolioId: number | null = null;
  portfolios: PortfolioListReadDTO[] = [];


  risks: Risk[] = [
    {
      code: 3,
      name: 'Mudança estratégia',
      probability: 1,
      impact: 3,
      severity: 3,
      resolvedOccurrences: 3,
      unresolvedOccurrences: 1
    },
    {
      code: 6,
      name: 'Escassez de recursos',
      probability: 2,
      impact: 3,
      severity: 6,
      resolvedOccurrences: 4,
      unresolvedOccurrences: 2
    },
    {
      code: 8,
      name: 'Escassez de recursos',
      probability: 2,
      impact: 3,
      severity: 6,
      resolvedOccurrences: 4,
      unresolvedOccurrences: 2
    }
  ];

  objectives = [
    { name: 'Nome do objetivo 1', description: 'Descrição do objetivo.' },
    { name: 'Nome do objetivo 2', description: 'Descrição do objetivo.' },
    { name: 'Nome do objetivo 3', description: 'Descrição do objetivo.' }
  ];
  portfolioDetails: PortfolioReadDTO | null = null;
  projetos: ProjectReadDTO2[] = [];


  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'Início',
        url: '/inicio',
        isActive: false
      },
      {
        label: 'Dashboard',
        url: '/dashboard',
        isActive: true
      }
    ]);
    this.breadcrumbService.removeChildrenAfter('/dashboard');
    this.loadPortfolios();
  }

  ngAfterViewInit(): void {
    // Os gráficos só serão criados após carregar os dados do portfólio selecionado
  }


  loadPortfolios() {
    const queryParams = new PaginationQueryParams();
    this.portfolioService.getPortfoliosPage(queryParams).subscribe(page => {
      this.portfolios = page.content;
      if (this.portfolios.length > 0) {
        this.hasPortfolio = true;
        this.selectedPortfolioId = this.portfolios[0].id;
        this.loadPortfolioDetails(this.selectedPortfolioId);
      } else {
        this.hasPortfolio = false;
        this.selectedPortfolioId = null;
      }
    });
  }

  loadPortfolioDetails(portfolioId: number) {
    this.portfolioService.getPortfolioAnalytics(portfolioId).subscribe(details => {
      this.portfolioDetails = details.portfolio;
      console.log('Portfolio details loaded:', this.portfolioDetails);
      this.projetos = details.portfolio.projects;
      this.objetivos = [];
      // Buscar objetivos de cada estratégia ligada ao portfólio
      let strategies: any[] = [];
      if (this.portfolioDetails?.strategy) {
        if (Array.isArray(this.portfolioDetails.strategy)) {
          strategies = this.portfolioDetails.strategy;
        } else {
          strategies = [this.portfolioDetails.strategy];
        }
      }
      strategies.forEach((strategy) => {
        if (strategy && strategy.id) {
          this.objetivoService.getObjectivesPage(strategy.id).subscribe((objPage: Page<Objective>) => {
            if (objPage && objPage.content) {
              this.objetivos = [...this.objetivos, ...objPage.content];
            }
          });
        }
      });
      setTimeout(() => {
        this.createCostChart();
        this.createProjectBubbleChart();
        this.createRiskBubbleChart();
      }, 100);
    });
  }

  createCostChart() {
    // Verificar se o elemento canvas existe e está acessível
    if (!this.costChartRef || !this.costChartRef.nativeElement) {
      console.warn('Canvas element not found or not accessible, retrying...');
      // Tentar novamente após um breve delay
      setTimeout(() => {
        if (this.costChartRef && this.costChartRef.nativeElement) {
          this.createCostChart();
        }
      }, 100);
      return;
    }

    // Verificar se o elemento está visível no DOM
    const canvasElement = this.costChartRef.nativeElement;
    if (canvasElement.offsetParent === null) {
      console.warn('Canvas element is not visible, retrying...');
      setTimeout(() => {
        this.createCostChart();
      }, 100);
      return;
    }

    // Destruir o gráfico anterior se existir
    if (this.costChart) {
      this.costChart.destroy();
    }

    try {
      const ctx = canvasElement.getContext('2d');

      if (!ctx) {
        console.error('Cannot get 2D context from canvas');
        return;
      }

      const labels = this.projetos.map(p => p.name);
      const plannedValues = this.projetos.map(p => p.plannedValue ?? 0);
      const earnedValues = this.projetos.map(p => p.earnedValue ?? 0);

      this.costChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Custo Planejado (R$)',
              data: plannedValues,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Custo Real (R$)',
              data: earnedValues,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Valor (R$)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Projetos'
              }
            }
          }
        }
      });

      console.log('Chart created successfully');
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  createProjectBubbleChart() {
    // Verificar se o elemento canvas existe e está acessível
    if (!this.projectBubbleChartRef || !this.projectBubbleChartRef.nativeElement) {
      console.warn('Project bubble chart canvas element not found or not accessible, retrying...');
      // Tentar novamente após um breve delay
      setTimeout(() => {
        if (this.projectBubbleChartRef && this.projectBubbleChartRef.nativeElement) {
          this.createProjectBubbleChart();
        }
      }, 100);
      return;
    }

    // Verificar se o elemento está visível no DOM
    const canvasElement = this.projectBubbleChartRef.nativeElement;
    if (canvasElement.offsetParent === null) {
      console.warn('Project bubble chart canvas element is not visible, retrying...');
      setTimeout(() => {
        this.createProjectBubbleChart();
      }, 100);
      return;
    }

    // Destruir o gráfico anterior se existir
    if (this.projectBubbleChart) {
      this.projectBubbleChart.destroy();
    }

    try {
      const ctx = canvasElement.getContext('2d');

      if (!ctx) {
        console.error('Cannot get 2D context from project bubble chart canvas');
        return;
      }

      this.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Projeto 1',
              data: [
                {
                  x: 7, // Payback (meses)
                  y: 8, // Alinhamento estratégico (escala 1-10)
                  r: 15 // Tamanho da bolha (representando valor do projeto)
                }
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2
            },
            {
              label: 'Projeto 2',
              data: [
                {
                  x: 12, // Payback (meses)
                  y: 6, // Alinhamento estratégico (escala 1-10)
                  r: 20 // Tamanho da bolha
                }
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            },
            {
              label: 'Projeto 3',
              data: [
                {
                  x: 9, // Payback (meses)
                  y: 9, // Alinhamento estratégico (escala 1-10)
                  r: 18 // Tamanho da bolha
                }
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.dataset.label || '';
                  return `${label}: Payback ${context.parsed.x} meses, Alinhamento ${context.parsed.y}/10`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Payback (meses)'
              },
              min: 0,
              max: 15
            },
            y: {
              title: {
                display: true,
                text: 'Alinhamento Estratégico (1-10)'
              },
              min: 0,
              max: 10
            }
          }
        }
      });

      console.log('Project bubble chart created successfully');
    } catch (error) {
      console.error('Error creating project bubble chart:', error);
    }
  }

  createRiskBubbleChart() {
    // Verificar se o elemento canvas existe e está acessível
    if (!this.riskBubbleChartRef || !this.riskBubbleChartRef.nativeElement) {
      console.warn('Risk bubble chart canvas element not found or not accessible, retrying...');
      // Tentar novamente após um breve delay
      setTimeout(() => {
        if (this.riskBubbleChartRef && this.riskBubbleChartRef.nativeElement) {
          this.createRiskBubbleChart();
        }
      }, 100);
      return;
    }

    // Verificar se o elemento está visível no DOM
    const canvasElement = this.riskBubbleChartRef.nativeElement;
    if (canvasElement.offsetParent === null) {
      console.warn('Risk bubble chart canvas element is not visible, retrying...');
      setTimeout(() => {
        this.createRiskBubbleChart();
      }, 100);
      return;
    }

    // Destruir o gráfico anterior se existir
    if (this.riskBubbleChart) {
      this.riskBubbleChart.destroy();
    }

    try {
      const ctx = canvasElement.getContext('2d');

      if (!ctx) {
        console.error('Cannot get 2D context from risk bubble chart canvas');
        return;
      }

      this.riskBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: [
            {
              label: 'Risco 3 - Mudança estratégia',
              data: [
                {
                  x: 1, // Probabilidade (1-5)
                  y: 3, // Impacto (1-5)
                  r: 8 // Severidade (tamanho da bolha)
                }
              ],
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2
            },
            {
              label: 'Risco 6 - Escassez de recursos',
              data: [
                {
                  x: 2, // Probabilidade (1-5)
                  y: 3, // Impacto (1-5)
                  r: 15 // Severidade (tamanho da bolha)
                }
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2
            },
            {
              label: 'Risco 8 - Mudança de escopo',
              data: [
                {
                  x: 2, // Probabilidade (1-5)
                  y: 3, // Impacto (1-5)
                  r: 15 // Severidade (tamanho da bolha)
                }
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.dataset.label || '';
                  return `${label}: Probabilidade ${context.parsed.x}, Impacto ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Probabilidade (1-5)'
              },
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            },
            y: {
              title: {
                display: true,
                text: 'Impacto (1-5)'
              },
              min: 0,
              max: 5,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });

      console.log('Risk bubble chart created successfully');
    } catch (error) {
      console.error('Error creating risk bubble chart:', error);
    }
  }

  toggleSection(section: string): void {
    const index = this.expandedSections.indexOf(section);
    if (index > -1) {
      this.expandedSections.splice(index, 1);
    } else {
      this.expandedSections.push(section);
    }

  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.includes(section);
  }

  onPortfolioChange(portfolioId: number | null): void {
    if (portfolioId != null) {
      this.selectedPortfolioId = portfolioId;
      this.loadPortfolioDetails(portfolioId);
    }
  }

  ngOnDestroy(): void {
    // Limpar o gráfico quando o componente for destruído
    if (this.costChart) {
      this.costChart.destroy();
    }
    if (this.projectBubbleChart) {
      this.projectBubbleChart.destroy();
    }
    if (this.riskBubbleChart) {
      this.riskBubbleChart.destroy();
    }
  }

  // Método para inicializar o gráfico quando hasPortfolio mudar
  onHasPortfolioChange(): void {
    this.hasPortfolio = true;
    // Forçar detecção de mudanças
    this.cdr.detectChanges();
    // Aguardar a renderização do elemento antes de criar o gráfico
    setTimeout(() => {
      this.createCostChart();
      this.createProjectBubbleChart();
      this.createRiskBubbleChart();
    }, 300);
  }
  getPortfolioProgress(): number {
    if (!this.projetos || this.projetos.length === 0) return 0;
    const total = this.projetos.reduce((sum, p) => sum + (p.percentComplete || 0), 0);
    return Math.round(total / this.projetos.length);
  }
}
