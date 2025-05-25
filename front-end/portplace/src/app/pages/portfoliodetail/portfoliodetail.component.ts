import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPortfolioModalComponent } from '../../components/edit-portfolio-modal/edit-portfolio-modal.component';
import { RiskModalComponent } from '../../components/risk-modal/risk-modal.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  status: string;
  lastUpdate: string;
}

interface Project {
  id: number;
  name: string;
  budget: string;
  ev: string;
  pv: string;
  startDate: string;
  endDate: string;
  status: string;
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

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfoliodetail.component.html',
  styleUrls: ['./portfoliodetail.component.css'],
  imports: [CommonModule,
    FormsModule,
    EditPortfolioModalComponent,
    RiskModalComponent,
    CardComponent,
    BadgeComponent],
  standalone: true
})
export class PortfolioDetailComponent implements OnInit {
  portfolioId!: number;
  portfolio!: Portfolio;
  activeTab = 'resumo';
  showEditModal = false;
  showRiskModal = false;
  editingRisk: Risk | null = null;

  projects: Project[] = [
    {
      id: 1,
      name: 'Projeto 1',
      budget: 'R$ 1.000,00',
      ev: 'R$ 10.000,00',
      pv: 'R$ 11.000,00',
      startDate: '01/01/2025',
      endDate: '10/05/2025',
      status: 'EM ANÁLISE'
    },
    {
      id: 2,
      name: 'Projeto 2',
      budget: 'R$ 1.000,00',
      ev: 'R$ 150.000,00',
      pv: '130.000,00',
      startDate: '03/01/2025',
      endDate: '20/06/2025',
      status: 'EM ANÁLISE'
    }
  ];

  risks: Risk[] = [
    {
      id: 1,
      code: 1,
      name: 'Mudança estratégia',
      probability: 1,
      impact: 3,
      severity: 3,
      unresolvedOccurrences: 3
    },
    {
      id: 2,
      code: 2,
      name: 'Escassez de recursos',
      probability: 2,
      impact: 3,
      severity: 6,
      unresolvedOccurrences: 2
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.portfolioId = +params['id'];
      this.loadPortfolio();
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

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  onBack(): void {
    this.router.navigate(['/portfolios']);
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
}
