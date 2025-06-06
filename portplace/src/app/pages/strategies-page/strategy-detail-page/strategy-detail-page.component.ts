import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { CriteriaGroup, EvaluationGroup, Objective, Scenario } from '../../../interface/interfacies';

@Component({
  selector: 'app-strategy-detail-page',
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent],
  templateUrl: './strategy-detail-page.component.html',
  styleUrl: './strategy-detail-page.component.scss'
})
export class StrategyDetailPageComponent implements OnInit{
  strategy: any = {
    id: '2',
    name: 'Estratégia 2024',
    status: 'ATIVO',
    description: 'Descrição da estratégia.',
    lastUpdate: 'Última alteração realizada por Carlos Bentes em 01/01/2025 14:30'
  };

  objectives: Objective[] = [
    {
      id: '1',
      name: 'Aumentar lucro',
      linkedCriteria: 1,
      activePortfolios: 1,
      activeProjects: 2,
      status: 'ATIVADO',
      statusColor: 'green'
    },
    {
      id: '2',
      name: 'Capacitar empregados',
      linkedCriteria: 0,
      activePortfolios: 0,
      activeProjects: 1,
      status: 'CANCELADO',
      statusColor: 'gray'
    }
  ];
  criteriaGroups: CriteriaGroup[] = [
    {
      id: "1",
      name: "Grupo de critério 1",
      criteriaGroup: "Aumentar lucro V2",
    },
    {
      id: "2",
      name: "Grupo de critério 2",
      criteriaGroup: "Aumentar lucro V2",
    },
  ]

  evaluationGroups: EvaluationGroup[] = [
    {
      id: "1",
      name: "Avaliação 2",
      criteriaGroup: "Aumentar lucro V2",
    },
    {
      id: "2",
      name: "Avaliação 1",
      criteriaGroup: "Aumentar lucro V2",
    },
  ]

  scenarios: Scenario[] = [
    {
      id: "1",
      name: "CAIXA libera empréstimo",
      budget: "R$ 1.000.000,00",
      evaluation: "Avaliação 2",
      selectedProjects: 8,
      status: "AGUARDANDO AUTORIZAÇÃO",
      statusColor: "yellow",
    },
    {
      id: "2",
      name: "CAIXA não libera empréstimo",
      budget: "R$ 500.000,00",
      evaluation: "Avaliação 2",
      selectedProjects: 3,
      status: "AUTORIZADO",
      statusColor: "green",
    },
    {
      id: "3",
      name: "Contratos 2026 não são fechados",
      budget: "R$ 200.000,00",
      evaluation: "Avaliação 1",
      selectedProjects: 2,
      status: "CANCELADO",
      statusColor: "gray",
    },
  ]

   // Filtered arrays
  filteredObjectives: Objective[] = []
  filteredCriteriaGroups: CriteriaGroup[] = []
  filteredEvaluationGroups: EvaluationGroup[] = []
  filteredScenarios: Scenario[] = []

  // Tab and filter states
  activeTab = "objetivos"
  objectiveFilter = ""
  objectiveSearchTerm = ""
  criteriaSearchTerm = ""
  evaluationSearchTerm = ""
  scenarioFilter = ""
  scenarioSearchTerm = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filteredObjectives = [...this.objectives];
    this.filteredCriteriaGroups = [...this.criteriaGroups];
    this.filteredEvaluationGroups = [...this.evaluationGroups];
    this.filteredScenarios = [...this.scenarios];
  }

  goBack(): void {
    this.router.navigate(['/strategies']);
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
  }

  // Criteria methods
  onCriteriaSearchChange(): void {
    this.applyCriteriaFilters()
  }

  applyCriteriaFilters(): void {
    let filtered = [...this.criteriaGroups]

    if (this.criteriaSearchTerm) {
      filtered = filtered.filter(
        (criteria) =>
          criteria.name.toLowerCase().includes(this.criteriaSearchTerm.toLowerCase()) ||
          criteria.criteriaGroup.toLowerCase().includes(this.criteriaSearchTerm.toLowerCase()),
      )
    }

    this.filteredCriteriaGroups = filtered
  }

  openCriteriaModal(criteria?: CriteriaGroup): void {
    console.log("Opening criteria modal", criteria)
    // Implementar modal de critério
  }

  // Evaluation methods
  onEvaluationSearchChange(): void {
    this.applyEvaluationFilters()
  }

  applyEvaluationFilters(): void {
    let filtered = [...this.evaluationGroups]

    if (this.evaluationSearchTerm) {
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.name.toLowerCase().includes(this.evaluationSearchTerm.toLowerCase()) ||
          evaluation.criteriaGroup.toLowerCase().includes(this.evaluationSearchTerm.toLowerCase()),
      )
    }

    this.filteredEvaluationGroups = filtered
  }

  openEvaluationModal(evaluation?: EvaluationGroup): void {
    console.log("Opening evaluation modal", evaluation)
    // Implementar modal de avaliação
  }

  // Scenario methods
  onScenarioFilterChange(filter: string): void {
    this.scenarioFilter = this.scenarioFilter === filter ? "" : filter
    this.applyScenarioFilters()
  }

  onScenarioSearchChange(): void {
    this.applyScenarioFilters()
  }

  applyScenarioFilters(): void {
    let filtered = [...this.scenarios]

    if (this.scenarioFilter) {
      filtered = filtered.filter((scenario) => {
        const status = scenario.status.toLowerCase()
        if (this.scenarioFilter === "aguardando") {
          return status.includes("aguardando")
        }
        return status.includes(this.scenarioFilter.toLowerCase())
      })
    }

    if (this.scenarioSearchTerm) {
      filtered = filtered.filter((scenario) =>
        scenario.name.toLowerCase().includes(this.scenarioSearchTerm.toLowerCase()),
      )
    }

    this.filteredScenarios = filtered
  }

  openScenarioModal(scenario?: Scenario): void {
    console.log("Opening scenario modal", scenario)
    // Implementar modal de cenário
  }
  getTabName(tab: string): string {
    const tabNames: { [key: string]: string } = {
      'criterios': 'Grupos de critérios',
      'avaliacoes': 'Grupos de avaliações',
      'cenarios': 'Cenários',
      'portfolios': 'Portfólios e projetos'
    };
    return tabNames[tab] || tab;
  }

  onObjectiveFilterChange(filter: string): void {
    this.objectiveFilter = this.objectiveFilter === filter ? '' : filter;
    this.applyObjectiveFilters();
  }

  onObjectiveSearchChange(): void {
    this.applyObjectiveFilters();
  }

  applyObjectiveFilters(): void {
    let filtered = [...this.objectives];

    if (this.objectiveFilter) {
      filtered = filtered.filter(objective =>
        objective.status.toLowerCase() === this.objectiveFilter.toLowerCase()
      );
    }

    if (this.objectiveSearchTerm) {
      filtered = filtered.filter(objective =>
        objective.name.toLowerCase().includes(this.objectiveSearchTerm.toLowerCase())
      );
    }

    this.filteredObjectives = filtered;
  }

  openObjectiveModal(objective?: Objective): void {
    // Implementar modal de objetivo
  }
}
