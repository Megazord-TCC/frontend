import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { Project, ProjectStatusEnum } from '../../interface/interfacies';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';


@Component({
  selector: 'app-projectspage',
  imports: [CommonModule, FormsModule, CardComponent,BadgeComponent,SvgIconComponent],
  templateUrl: './projectspage.component.html',
  styleUrl: './projectspage.component.scss'
})
export class ProjectsComponent implements OnInit {
 projects: Project[] = [
    {
      id: '1',
      name: 'Projeto 1',
      portfolio: 'Portfólio 1',
      budget: 'R$ 1.000,00',
      ev: 'R$ 10.000,00',
      pv: 'R$ 11.000,00',
      startDate: '01/01/2025',
      endDate: '10/05/2025',
      status: ProjectStatusEnum.CANDIDATE,
      statusColor: 'yellow'
    },
    {
      id: '2',
      name: 'Projeto 2',
      portfolio: 'Sem portfólio',
      budget: 'R$ 1.000,00',
      ev: 'R$ 150.000,00',
      pv: '130.000,00',
      startDate: '03/01/2025',
      endDate: '20/06/2025',
      status: ProjectStatusEnum.PLANNING,
      statusColor: 'yellow'
    }
  ];

  filteredProjects: Project[] = [];
  searchTerm = '';
  activeFilter = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredProjects = [...this.projects];
  }

  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
  let filtered = [...this.projects];

  if (this.activeFilter) {
    const filterMap: { [key: string]: ProjectStatusEnum } = {
      'em-analise': ProjectStatusEnum.CANDIDATE,
      'em-andamento': ProjectStatusEnum.PLANNING,
      'finalizado': ProjectStatusEnum.IN_PROGRESS,
      'cancelado': ProjectStatusEnum.FINISHED
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

  this.filteredProjects = filtered;
}

  onProjectClick(projectId: string): void {
    this.router.navigate(['/projeto', projectId]);
  }

  openCreateModal(): void {
    // Implementar modal de criação
  }

  getStatusLabel(status: ProjectStatusEnum): string {
    switch (status) {
      case ProjectStatusEnum.CANDIDATE:
        return 'EM ANÁLISE';
      case ProjectStatusEnum.PLANNING:
        return 'EM PLANEJAMENTO';
      case ProjectStatusEnum.IN_PROGRESS:
        return  'EM ANDAMENTO';
      case ProjectStatusEnum.FINISHED:
        return 'CANCELADO';
      default:
        return '';
    }
  }
}
