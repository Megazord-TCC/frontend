import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { AllocationService } from '../../../../service/allocation.service';
import { DailyAllocationDTO } from '../../../../interface/allocation-interfaces';

@Component({
  selector: 'app-pool-graphic',
  imports: [CommonModule],
  templateUrl: './pool-graphic.component.html',
  styleUrl: './pool-graphic.component.scss'
})
export class PoolGraphicComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() selectedResource: string = '';
  @Input() selectedProject: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  @ViewChild('stackedChart', { static: false }) stackedChartRef!: ElementRef<HTMLCanvasElement>;

  stackedChart: any;
  allocationService = inject(AllocationService);

  // Dados de exemplo - substitua pelos seus dados reais
  chartData: any[] = [];
  labels: string[] = [];

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.createStackedChart();
      if (this.startDate && this.endDate) {
        this.loadChartData();
      }
    }, 100);
  }

  ngOnChanges(): void {
    if (this.startDate && this.endDate) {
      this.loadChartData();
    }
  }

  loadChartData(): void {
    const resourceId = this.selectedResource !== 'all' ? Number(this.selectedResource) : undefined;
    const projectId = this.selectedProject !== 'all' ? Number(this.selectedProject) : undefined;

    this.allocationService.getAllocationsByDateRange(this.startDate, this.endDate, resourceId, projectId).subscribe({
      next: (data: DailyAllocationDTO[]) => {
        if (data && data.length > 0) {
          this.processChartData(data);
        } else {
          this.setMockData();
        }
        if (this.stackedChart) {
          this.updateChartData();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do gráfico:', err);
        this.setMockData();
        if (this.stackedChart) {
          this.updateChartData();
        }
      }
    });
  }

  setMockData(): void {
    // Dados mockados para barras agrupadas (não empilhadas)
    this.chartData = [
      { name: 'Fernando B.', color: 'rgba(255, 99, 132, 0.8)', data: [3, 3.5, 2, 3, 0, 0, 4.5], totalHours: 16 },
      { name: 'Julio M.', color: 'rgba(75, 192, 192, 0.8)', data: [0.5, 0.5, 0.5, 0.5, 0, 0, 1], totalHours: 3 },
      { name: 'Rogério S.', color: 'rgba(54, 162, 235, 0.8)', data: [2.5, 2, 2.5, 2.5, 0, 0, 2.5], totalHours: 10 }
    ];
    this.labels = ['20/05', '21/05', '22/05', '23/05', '24/05', '25/05', '26/05'];
  }

  processChartData(data: DailyAllocationDTO[]): void {
    // Agrupar por recurso
    const resourceMap = new Map<string, { name: string, data: number[], totalHours: number, color: string }>();

    // Gerar labels (datas)
    this.labels = data.map(d => d.date);

    // Cores para recursos
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ];

    data.forEach((day, dayIndex) => {
      day.allocations.forEach(allocation => {
        const resourceName = allocation.resource.name;
        if (!resourceMap.has(resourceName)) {
          resourceMap.set(resourceName, {
            name: resourceName,
            data: new Array(data.length).fill(0),
            totalHours: 0,
            color: colors[resourceMap.size % colors.length]
          });
        }
        const resourceData = resourceMap.get(resourceName)!;
        resourceData.data[dayIndex] = allocation.dailyHours;
        resourceData.totalHours += allocation.dailyHours;
      });
    });

    // Ordenar por total de horas decrescente e limitar a 5
    const sortedResources = Array.from(resourceMap.values())
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 3);

    this.chartData = sortedResources;
  }



  createStackedChart() {
    if (!this.stackedChartRef || !this.stackedChartRef.nativeElement) {
      console.warn('Canvas element not found, retrying...');
      setTimeout(() => {
        if (this.stackedChartRef && this.stackedChartRef.nativeElement) {
          this.createStackedChart();
        }
      }, 100);
      return;
    }

    const canvasElement = this.stackedChartRef.nativeElement;
    if (canvasElement.offsetParent === null) {
      console.warn('Canvas element is not visible, retrying...');
      setTimeout(() => {
        this.createStackedChart();
      }, 100);
      return;
    }

    if (this.stackedChart) {
      this.stackedChart.destroy();
    }

    try {
      const ctx = canvasElement.getContext('2d');
      if (!ctx) {
        console.error('Cannot get 2D context from canvas');
        return;
      }

      const datasets = this.chartData.map(worker => ({
        label: worker.name,
        data: worker.data,
        backgroundColor: worker.color,
        borderColor: worker.color.replace('0.8', '1'),
        borderWidth: 1,
        barThickness: 40
      }));

      this.stackedChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Alocações Diárias por Recurso',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            },
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return `${context.dataset.label}: ${context.parsed.y}h`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: false, // Alterado para false para barras agrupadas
              grid: {
                display: false
              },
              ticks: {
                font: {
                  size: 11
                }
              }
            },
            y: {
              stacked: false, // Alterado para false para barras agrupadas
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 1,
                callback: function(value: any) {
                  return value + 'h';
                }
              },
              title: {
                display: false
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        }
      });


    } catch (error) {
      console.error( error);
    }
  }

  updateChartData() {
    if (this.stackedChart) {
      // Atualizar datasets e labels com dados reais
      const datasets = this.chartData.map(worker => ({
        label: worker.name,
        data: worker.data,
        backgroundColor: worker.color,
        borderColor: worker.color.replace('0.8', '1'),
        borderWidth: 1,
        barThickness: 40
      }));

      this.stackedChart.data.labels = this.labels;
      this.stackedChart.data.datasets = datasets;
      this.stackedChart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.stackedChart) {
      this.stackedChart.destroy();
    }
  }
}
