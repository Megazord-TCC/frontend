import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from "../../../components/badge/badge.component";
import { FormsModule } from '@angular/forms';
import { Evaluation, Indicator, Objective, Project, ProjectStatusEnum } from '../../../interface/interfacies';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';



@Component({
  selector: 'app-project-detailpage',
  imports: [CommonModule, FormsModule,BadgeComponent,SvgIconComponent],
  templateUrl: './project-detailpage.component.html',
  styleUrl: './project-detailpage.component.scss'
})
export class ProjectDetailpageComponent implements OnInit {
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

  objectives: Objective[] = [
    { id: '1', name: 'Nome do objetivo 1' },
    { id: '2', name: 'Nome do objetivo 2' },
    { id: '3', name: 'Nome do objetivo 3' }
  ];

  evaluations: Evaluation[] = [
    { id: '1', name: 'Nome do critério 1', weight: 30, value: 700 },
    { id: '2', name: 'Nome do critério 2', weight: 20, value: 700 },
    { id: '3', name: 'Nome do critério 3', weight: 50, value: 700 }
  ];

  allProjects: Project[] =[];
  activeTab = 'indicadores';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

   ngOnInit(): void {
    /*

    // Pega o id da rota
    const id = this.route.snapshot.paramMap.get('id');
    // Busca o projeto correspondente
    this.project = this.allProjects.find(p => p.id === id);
    // Aqui você pode tratar caso não encontre o projeto
    */
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  saveIndicator(indicator: Indicator): void {
    // Implement save logic
    console.log('Saving indicator:', indicator);
  }
}
