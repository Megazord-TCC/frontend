import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ProgressComponent } from '../../components/progress/progress.component';

interface MetricCard {
  title: string;
  subtitle: string;
  color: string;
  value?: string;
}

interface Risk {
  code: number;
  name: string;
  probability: number;
  impact: number;
  severity: number;
  resolvedOccurrences: number;
  unresolvedOccurrences: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ProgressComponent,
    BadgeComponent
  ],
})
export class DashboardComponent implements OnInit {
  hasPortfolio = true;
  expandedSections: string[] = [];
  selectedPortfolio = 'portfolio1';

  metricCards: MetricCard[] = [
    { title: 'Dentro do prazo', subtitle: 'Status do projeto', color: 'green' },
    { title: 'Ativo do planejado', subtitle: 'Status', color: 'blue' },
    { title: 'Estratégia 1', subtitle: 'Estratégia ativa', color: 'purple' },
    { title: 'R$ 1.000.000,00', subtitle: 'Valor total', color: 'none', value: 'R$ 1.000.000,00' },
    { title: 'Gabriel Martins', subtitle: 'Responsável', color: 'none' }
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

  ngOnInit(): void {}

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
  }
}
