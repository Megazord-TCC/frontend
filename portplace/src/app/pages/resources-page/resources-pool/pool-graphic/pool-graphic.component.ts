import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';

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

  // Dados de exemplo - substitua pelos seus dados reais
  chartData = [
    { name: 'Fernando B.', color: 'rgba(255, 99, 132, 0.8)', data: [3, 3.5, 2, 3, 0, 0, 4.5, 5.5, 5, 5, 5.5, 0] },
    { name: 'Julio M.', color: 'rgba(75, 192, 192, 0.8)', data: [0.5, 0.5, 0.5, 0.5, 0, 0, 1, 1, 1, 1, 1, 0] },
    { name: 'Rogério S.', color: 'rgba(54, 162, 235, 0.8)', data: [2.5, 2, 2.5, 2.5, 0, 0, 2.5, 2.5, 3, 3, 2.5, 0] }
  ];

  labels = ['20/05', '21/05', '22/05', '23/05', '24/05', '25/05', '26/05', '27/05', '28/05', '29/05', '30/05', '31/05'];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createStackedChart();
    }, 100);
  }

  ngOnChanges(): void {
    if (this.stackedChart) {
      this.updateChartData();
    }
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
              stacked: true,
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
              stacked: true,
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

      console.log('Stacked chart created successfully');
    } catch (error) {
      console.error('Error creating stacked chart:', error);
    }
  }

  updateChartData() {
    // Aqui você implementaria a lógica para atualizar os dados
    // baseado nos filtros (selectedResource, selectedProject, startDate, endDate)
    if (this.stackedChart) {
      // Filtrar dados baseado nos inputs
      // this.stackedChart.data.datasets = ...
      // this.stackedChart.data.labels = ...
      this.stackedChart.update();
    }
  }

  ngOnDestroy(): void {
    if (this.stackedChart) {
      this.stackedChart.destroy();
    }
  }
}
