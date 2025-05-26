import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
import { PortfolioModalComponent } from '../../components/portfolio-modal/portfolio-modal.component';
type BadgeColor = 'gray' | 'green' | 'blue' | 'red' | 'yellow';
interface Portfolio {
  id: number;
  name: string;
  budget: string;
  inProgress: number;
  completed: number;
  cancelled: number;
  status: string;
  statusColor: BadgeColor;
}

@Component({
  selector: 'app-portfolios',
  templateUrl: './portfolios.component.html',
  styleUrls: ['./portfolios.component.scss'],
   imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    PortfolioModalComponent,

  ],
})
export class PortfoliosComponent implements OnInit {
  showModal = false;
  activeFilter = 'all';
  searchTerm = '';

  portfolios: Portfolio[] = [
    {
      id: 1,
      name: 'Portfólio 1',
      budget: 'R$ 1.000,00',
      inProgress: 3,
      completed: 4,
      cancelled: 6,
      status: 'VAZIO',
      statusColor: 'gray'
    },
    {
      id: 2,
      name: 'Portfólio 2',
      budget: 'R$ 1.000,00',
      inProgress: 2,
      completed: 5,
      cancelled: 2,
      status: 'EM ANDAMENTO',
      statusColor: 'green'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onFilterChange(filter: string): void {
    this.activeFilter = filter;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
  }

  onPortfolioClick(portfolioId: number): void {
    this.router.navigate(['/portfolio', portfolioId]);
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
