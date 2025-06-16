import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CriteriaGroup,
  Evaluation,
  EvaluationGroup,
  EvaluationGroupView,
  Project
} from '../../../interface/carlos-interfaces';
import { forkJoin, map, firstValueFrom } from 'rxjs';
import { ProjectCriteriaEvaluationModal } from '../../../components/project-criteria-evaluation-modal/project-criteria-evaluation-modal.component';
import { Criterion } from '../../../interface/interfacies';

// Interface local para combinar dados de critério com avaliação
interface CriteriaEvaluation {
  id: number;
  name: string;
  description: string;
  weight: number;
  score: number;
  evaluationId?: number;
}

@Component({
  selector: 'app-project-evaluation-detail',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    ProjectCriteriaEvaluationModal
  ],
  templateUrl: './project-evaluation-detail.component.html',
  styleUrl: './project-evaluation-detail.component.scss'
})
export class ProjectEvaluationDetailComponent implements OnInit {

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);

  // Parâmetros da rota
  strategyId = -1;
  evaluationGroupId = -1;
  projectId = -1;

  // Dados carregados
  project: Project | undefined;
  evaluationGroup: EvaluationGroupView | undefined;
  criteriaEvaluations: CriteriaEvaluation[] = [];

  // Estados do componente
  showEvaluationModal = false;

  ngOnInit(): void {
    console.log('🚀 Inicializando ProjectEvaluationDetailComponent');

    // Extrair parâmetros da rota
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    this.evaluationGroupId = Number(this.route.snapshot.paramMap.get('grupoAvaliacaoId'));
    this.projectId = Number(this.route.snapshot.paramMap.get('projetoId'));

    console.log('📊 Parâmetros da rota:', {
      strategyId: this.strategyId,
      evaluationGroupId: this.evaluationGroupId,
      projectId: this.projectId
    });

    // Carregar todos os dados necessários
    this.loadData();
  }

  loadData(): void {
    console.log('📋 Carregando dados do projeto e avaliações...');
    this.loadProject();
    this.loadEvaluationGroup();
    this.loadCriteriaEvaluations();
  }

  loadProject(): void {
    const projectRoute = `${environment.apiUrl}/projects/${this.projectId}`;
    console.log('🔍 Buscando projeto:', projectRoute);

    this.httpClient.get<Project>(projectRoute).subscribe({
      next: (project) => {
        console.log('✅ Projeto carregado:', project);
        this.project = project;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar projeto:', error);
      }
    });
  }

  loadEvaluationGroup(): void {
    const evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps`;
    const criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;

    console.log('🔍 Buscando grupo de avaliação e critérios...');

    const getAllEvaluationGroups$ = this.httpClient.get<EvaluationGroup[]>(evaluationGroupsRoute);
    const getAllCriteriaGroups$ = this.httpClient.get<CriteriaGroup[]>(criteriaGroupsRoute);

    forkJoin({
      evaluationGroups: getAllEvaluationGroups$,
      criteriaGroups: getAllCriteriaGroups$
    })
      .pipe(
        map(({ evaluationGroups, criteriaGroups }) =>
          this.getManyEvaluationGroupView(evaluationGroups, criteriaGroups)
        ),
        map(evaluationGroups =>
          evaluationGroups.find(evaluationGroup => evaluationGroup.id == this.evaluationGroupId)
        )
      )
      .subscribe({
        next: (evaluationGroup) => {
          console.log('✅ Grupo de avaliação carregado:', evaluationGroup);
          this.evaluationGroup = evaluationGroup;
        },
        error: (error) => {
          console.error('❌ Erro ao carregar grupo de avaliação:', error);
        }
      });
  }

  getManyEvaluationGroupView(evaluationGroups: EvaluationGroup[], criteriaGroups: CriteriaGroup[]): EvaluationGroupView[] {
    return evaluationGroups.map(evaluationGroup => ({
      ...evaluationGroup,
      criteriaGroup: criteriaGroups.find(criteriaGroup => criteriaGroup.id == evaluationGroup.criteriaGroupId)
    }));
  }

  async loadCriteriaEvaluations(): Promise<void> {
    try {
      console.log('📋 Carregando critérios e avaliações...');

      // 1. Buscar grupo de avaliação para obter criteriaGroupId
      const evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}`;
      const evaluationGroup = await firstValueFrom(
        this.httpClient.get<EvaluationGroup>(evaluationGroupRoute)
      );

      console.log('📊 Grupo de avaliação encontrado:', evaluationGroup);

      // 2. Buscar critérios do grupo usando criteriaGroupId
      const criteriaRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups/${evaluationGroup.criteriaGroupId}/criteria`;
      const criteria = await firstValueFrom(
        this.httpClient.get<Criterion[]>(criteriaRoute) // CORRIGIDO: usar Criterion[]
      );

      console.log('📝 Critérios encontrados:', criteria);

      // 3. Buscar avaliações existentes para este projeto
      const evaluationsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/evaluations`;
      const evaluations = await firstValueFrom(
        this.httpClient.get<Evaluation[]>(evaluationsRoute)
      );

      console.log('⭐ Avaliações encontradas:', evaluations);

      // 4. Combinar critérios com avaliações existentes - CORRIGIDO: ATRIBUIR AO this.criteriaEvaluations
      this.criteriaEvaluations = criteria.map(criterion => {
        const evaluation = evaluations.find(e =>
          e.criterionId === criterion.id && this.project && e.projectId === this.project.id
        );
        return {
          id: criterion.id,
          name: criterion.name,
          description: criterion.description || '', // GARANTIR QUE NÃO SEJA UNDEFINED
          weight: criterion.weight,
          score: evaluation ? evaluation.score : 0,
          evaluationId: evaluation ? Number(evaluation.id) : undefined
        };
      });

      console.log('✅ Critérios com avaliações combinados:', this.criteriaEvaluations);
      console.log('📊 Total de critérios para avaliação:', this.criteriaEvaluations.length);

    } catch (error) {
      console.error('❌ Erro ao carregar critérios e avaliações:', error);
    }
  }

  // Métodos de navegação
  goToStrategiesPage(): void {
    this.router.navigate(['/estrategias']);
  }

  goToHomePage(): void {
    this.router.navigate(['/inicio']);
  }

  goToStrategyPage(): void {
    this.router.navigateByUrl(`estrategia/${this.strategyId}`);
  }

  goBack(): void {
    this.router.navigateByUrl(`estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}`);
  }

  // Métodos do modal de avaliação
  openEvaluationModal(): void {
    console.log('🎯 Abrindo modal de avaliação');
    console.log('📋 Critérios disponíveis para avaliação:', this.criteriaEvaluations);
    this.showEvaluationModal = true;
  }

  closeEvaluationModal(): void {
    console.log('❌ Fechando modal de avaliação');
    this.showEvaluationModal = false;
  }

  onEvaluationUpdated(): void {
    console.log('🔄 Avaliação atualizada, recarregando dados...');
    this.loadCriteriaEvaluations();
  }

  // Métodos utilitários
  getTotalScore(): number {
    return this.criteriaEvaluations.reduce((total, criterion) => { // CORRIGIDO: usar criterion
      return total + (criterion.score * criterion.weight);
    }, 0);
  }

  formatWeight(weight: number): string {
    return Math.round(weight * 100) + '%';
  }
}
