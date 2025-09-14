import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ProgressComponent } from '../../components/progress/progress.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Router } from '@angular/router';
import { Risk, MetricCard } from '../../interface/interfacies';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../service/auth-service';
import { PageType } from '../../interface/carlos-auth-interfaces';

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
  @ViewChild('costChart', { static: false }) costChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectBubbleChart', { static: false }) projectBubbleChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('riskBubbleChart', { static: false }) riskBubbleChartRef!: ElementRef<HTMLCanvasElement>;

  private breadcrumbService = inject(BreadcrumbService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);
  costChart: any;
  projectBubbleChart: any;
  riskBubbleChart: any;
  pageType = PageType;

  hasPortfolio = true;
  expandedSections: string[] = [];
  selectedPortfolio = 'portfolio1';

  metricCards: MetricCard[] = [
    { title: 'Dentro do prazo', subtitle: 'Status do projeto', color: 'green', icon:'assets/icon/calendario_vetor.svg' },
    { title: 'Ativo do planejado', subtitle: 'Status', color: 'blue', icon:'assets/icon/paid_vetor.svg' },
    { title: 'Estratégia 1', subtitle: 'Estratégia ativa', color: 'purple', icon:'assets/icon/estrategia_vetor.svg' },
    { title: 'R$ 1.000.000,00', subtitle: 'Valor total', color: 'none', value: 'R$ 1.000.000,00', icon:'assets/icon/porco_vetor.svg' },
    { title: 'Gabriel Martins', subtitle: 'Responsável', color: 'none', icon:'assets/icon/user_vetor.svg  ' }
  ];

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



  ngOnInit(): void {
    // Configurar breadcrumbs para Dashboard
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

    // Remover breadcrumbs filhos quando retorna para esta página
    this.breadcrumbService.removeChildrenAfter('/dashboard');
  }

  ngAfterViewInit(): void {
    // Criar o gráfico apenas após a view estar inicializada
    if (this.hasPortfolio) {
      // Aguardar que o DOM esteja completamente renderizado
      setTimeout(() => {
        this.createCostChart();
        this.createProjectBubbleChart();
        this.createRiskBubbleChart();
      }, 100);
    }
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

      this.costChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            {
              label: 'Custo Planejado (R$)',
              data: [64000, 48000, 32000, 64000],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Custo Real (R$)',
              data: [48000, 80000, 32000, 48000],
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
                text: 'Trimestres'
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

  onPortfolioChange(value: string): void {
    this.selectedPortfolio = value;
    // Recriar o gráfico quando o portfólio for alterado
    setTimeout(() => {
      this.createCostChart();
      this.createProjectBubbleChart();
      this.createRiskBubbleChart();
    }, 100);
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
}
