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
import { PortfolioListReadDTO, PortfolioReadDTO, RiskOccurrenceStatusEnum, RiskReadDTO } from '../../interface/carlos-portfolio-interfaces';
import { PaginationQueryParams } from '../../models/pagination-models';
import { UserGetResponseDTO } from '../../interface/carlos-user-dtos';

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
  selectedPortfolioId: number = 0;
  selectedFormatry: string = 'pdf';
  availableFormats: string[] = ['pdf', 'excel'];
  portfolios: PortfolioListReadDTO[] = [];
  responsaveis: UserGetResponseDTO[] = [];


  risks: RiskReadDTO[] = [];
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
  openPortfolio(id: number) {
    this.router.navigate(['/portfolio', id]);
  }

  downloadFile(type: string) {
    if(type === 'pdf') {
      this.portfolioService.exportPortfolioPdf(this.selectedPortfolioId).subscribe(blob => {
        this.downloadBlob(blob, `portfolio_${this.selectedPortfolioId}.pdf`);
      });
    } else if(type === 'excel') {
      this.portfolioService.exportPortfolioExcel(this.selectedPortfolioId).subscribe(blob => {
        this.downloadBlob(blob, `portfolio_${this.selectedPortfolioId}.xlsx`);
      });
    }
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    globalThis.URL.revokeObjectURL(url);
  }

  loadPortfoliosAnalytics(portfolioId: number) {
    console.log('Loading portfolio analytics for portfolio ID:', portfolioId);
    if (portfolioId) {
      this.portfolioService.getPortfolioAnalytics(portfolioId).subscribe(details => {
        this.risks = details.risks;
        console.log('Risks loaded:', this.risks);
        console.log(details);
      });
    }
  }

  loadPortfolios() {
    const queryParams = new PaginationQueryParams();
    this.portfolioService.getPortfoliosPage(queryParams).subscribe(page => {
      this.portfolios = page.content;
      console.log('Portfolios loaded:', this.portfolios);
      if (this.portfolios.length > 0) {
        this.hasPortfolio = true;
        this.selectedPortfolioId = this.portfolios[0].id;
        this.loadPortfolioDetails(this.selectedPortfolioId);
        this.loadPortfoliosAnalytics(this.selectedPortfolioId);
      } else {
        this.hasPortfolio = false;
        this.selectedPortfolioId = 0;
      }
    });
  }

  loadPortfolioDetails(portfolioId: number) {
    this.portfolioService.getPortfolioAnalytics(portfolioId).subscribe(details => {
      this.portfolioDetails = details.portfolio;
      console.log('Portfolio details loaded:', this.portfolioDetails);
      this.projetos = details.portfolio.projects;
      this.responsaveis = details.portfolio.owners;
      this.objetivos = (details?.strategicObjectives ?? []).map((o: any) => ({
        name: o?.name ?? '',
        description: o?.description ?? ''
      }));
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

      const labels = this.projetos.slice(0,3).map(p => p.name);
      const plannedValues = this.projetos.slice(0,3).map(p => p.plannedValue ?? 0);
      const earnedValues = this.projetos.slice(0,3).map(p => p.earnedValue ?? 0);


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

      const projetos = this.projetos.slice(0, 3);
      const colors = [
        { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
        { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
        { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' }
      ];
      const datasets = projetos.map((p, i) => {
        const roi = p.roi ?? 0;
        const backgroundColor = roi < 0 ? 'rgba(255, 255, 255, 1)' : colors[i % colors.length].bg;

        return {
          label: p.name,
          data: [{
            x: p.payback ?? 0,
            y: p.scenarioRankingScore ?? 0,
            r: Math.max(20, Math.min(60, Math.round((p.budgetAtCompletion ?? 0) / 1000)))
          }],
          backgroundColor: backgroundColor,
          borderColor: colors[i % colors.length].border,
          borderWidth: 2
        };
      });

      this.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: datasets
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
                  return `${label}: Payback ${context.parsed.x} meses, Alinhamento ${context.parsed.y}`;
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
                text: 'Alinhamento Estratégico'
              },
              min: 0,
              max: 1000
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

    // Mapeamento de probabilidade e impacto para valores numéricos
    const probMap: any = { LOW: 1, MEDIUM: 3, HIGH: 5 };
    const impactMap: any = { LOW: 1, MEDIUM: 3, HIGH: 5 };
    const colors = [
      { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
      { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
      { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' }
    ];

    try {
      const ctx = canvasElement.getContext('2d');
      if (!ctx) {
        console.error('Cannot get 2D context from risk bubble chart canvas');
        return;
      }

      const datasets = this.risks.slice(0, 3).map((risk, i) => ({
        label: risk.name,
        data: [{
          x: probMap[risk.probability] ?? 0,
          y: impactMap[risk.impact] ?? 0,
          r: Math.max(8, Math.min(30, risk.severity ?? 8))
        }],
        backgroundColor: colors[i % colors.length].bg,
        borderColor: colors[i % colors.length].border,
        borderWidth: 2
      }));

      this.riskBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
          datasets: datasets
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
      this.loadPortfoliosAnalytics(portfolioId);
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
  getPortfolioStatusEnumToText = (statusEnum: any): string => {
    switch (statusEnum) {
          case "EMPTY": return "SEM PROJETOS";
          case "IN_PROGRESS": return "EM ANDAMENTO";
          case "COMPLETED": return "CONCLUÍDO";
          case "CANCELLED": return "CANCELADO";
          default: return "SEM STATUS";
      }
  }
  getPortfolioHealthEnumToText = (healthEnum: any): string => {
      switch (healthEnum) {
          case "RED": return "Fora do planejado";
          case "YELLOW": return "Requer atenção";
          case "GREEN": return "OK";
          default: return "Sem status";
      }
  }
  getRiskSeverityEnumToText = (severityEnum: any): string => {
      switch (severityEnum) {
          case "LOW": return "BAIXA";
          case "MEDIUM": return "MÉDIA";
          case "HIGH": return "ALTA";
          case "VERY_HIGH": return "MUITO ALTA";
          default: return "SEM STATUS";
      }
  }
  getOccurrencesSolvedCount(risk: RiskReadDTO): number {
    if (!risk.occurrences) return 0;
    return risk.occurrences.filter(o => o.status === RiskOccurrenceStatusEnum.SOLVED).length;
  }

  getOccurrencesNotSolvedCount(risk: RiskReadDTO): number {
    if (!risk.occurrences) return 0;
    return risk.occurrences.filter(o => o.status === RiskOccurrenceStatusEnum.NOT_SOLVED).length;
  }
}
