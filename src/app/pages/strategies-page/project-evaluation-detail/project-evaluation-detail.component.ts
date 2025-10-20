import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
  Project
} from '../../../interface/carlos-interfaces';
import { forkJoin, map, firstValueFrom, Subscription } from 'rxjs';
import { ProjectCriteriaEvaluationModal } from '../../../components/project-criteria-evaluation-modal/project-criteria-evaluation-modal.component';
import { Criterion, EvaluationGroupApiResponse, Strategy } from '../../../interface/interfacies';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { Page } from '../../../models/pagination-models';
import { EstrategiaService } from '../../../service/estrategia.service';

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
    SvgIconComponent,
    BreadcrumbComponent,
    ProjectCriteriaEvaluationModal
  ],
  templateUrl: './project-evaluation-detail.component.html',
  styleUrl: './project-evaluation-detail.component.scss'
})
export class ProjectEvaluationDetailComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  readonly httpClient = inject(HttpClient);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly breadcrumbService = inject(BreadcrumbService);


  strategyId = -1;
  evaluationGroupId = -1;
  projectId = -1;


  project: Project | undefined;
  evaluationGroup: EvaluationGroup | undefined;
  criteriaEvaluations: CriteriaEvaluation[] = [];


  readonly strategyService = inject(EstrategiaService);
  strategy: Strategy | undefined;
  showEvaluationModal = false;

  private updateBreadcrumbs(): void {
    const strategyName = this.strategy?.name;
    const groupName = this.evaluationGroup?.name;
    const projectName = this.project?.name;

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Início', url: '/inicio', isActive: false },
      { label: 'Estratégias', url: '/estrategias', isActive: false },
      { label: strategyName ? `Estratégia: ${strategyName}` : 'Estratégia', url: `/estrategia/${this.strategyId}`, isActive: false },
      { label: groupName ? `Grupo de Avaliação: ${groupName}` : 'Grupo de Avaliação', url: `/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}`, isActive: false },
      { label: projectName ? `Projeto: ${projectName}` : `Projeto ${this.projectId}`, url: `/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}/projeto/${this.projectId}`, isActive: true }
    ]);
  }

  ngOnInit(): void {
    console.log('🚀 Inicializando ProjectEvaluationDetailComponent');

    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      // Extrair parâmetros da rota
      this.strategyId = Number(params.get('estrategiaId'));
      this.evaluationGroupId = Number(params.get('grupoAvaliacaoId'));
      this.projectId = Number(params.get('projetoId'));
      // Carregar todos os dados necessários
      this.getStrategyById(this.strategyId);
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  getStrategyById(estrategiaId: number): void {
    this.strategyService.getStrategyById(estrategiaId)
      .subscribe(strategy => {
        this.strategy = strategy;
        this.updateBreadcrumbs();
      });
  }
  getGroupById(grupoAvaliacaoId: number): void {
    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;

    this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } })
        .pipe(map(page => page.content))
        .subscribe(evaluationGroups => {
            this.evaluationGroup = evaluationGroups.find(evaluationGroup => evaluationGroup.id == grupoAvaliacaoId);
            console.log('Grupo de Avaliação carregado:', this.evaluationGroup);
        });
  }
  loadData(): void {
    console.log('📋 Carregando dados do projeto e avaliações...');
    this.loadCriteriaEvaluations();
    this.loadEvaluationGroup();
    this.loadProject();
  }

  loadProject(): void {
    const projectRoute = `${environment.apiUrl}/projects/${this.projectId}`;
    console.log('🔍 Buscando projeto:', projectRoute);

    this.httpClient.get<Project>(projectRoute).subscribe({
      next: (project) => {
        console.log('✅ Projeto carregado:', project);
        console.log('Grupo de avaliação atual:', this.evaluationGroup);
        this.project = project;
        this.updateBreadcrumbs();

      },
      error: (error) => {
        console.error('❌ Erro ao carregar projeto:', error);
      }
    });
  }

  loadEvaluationGroup(): void {
    const evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;

    this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } })
        .pipe(map(page => page.content))
        .subscribe(evaluationGroups => {
            this.evaluationGroup = evaluationGroups.find(evaluationGroup => evaluationGroup.id == this.evaluationGroupId);
      this.updateBreadcrumbs();
        });
  }

  async loadCriteriaEvaluations(): Promise<void> {
    try {
      console.log('📋 Carregando critérios e avaliações...');

      // 1. Buscar grupo de avaliação para obter criteriaGroupId
      const evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups/${this.evaluationGroupId}`;
      const evaluationGroup = await firstValueFrom(
        this.httpClient.get<any>(evaluationGroupRoute)
      );
      this.evaluationGroup = evaluationGroup;
      console.log('📊 Grupo de avaliação encontrado:', this.evaluationGroup);
      this.updateBreadcrumbs();

      // 2. Buscar critérios do grupo usando criteriaGroupId
      const criteriaRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups/${evaluationGroup?.criteriaGroup?.id}/criteria`;
      const criteria = await firstValueFrom(
        this.httpClient.get<Page<Criterion>>(criteriaRoute, { params: { size: 1000 } }).pipe(map(page => page.content))
      );

      console.log('📝 Critérios encontrados:', criteria);

      // 3. Buscar avaliações existentes para este projeto
      const evaluationsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups/${this.evaluationGroupId}/evaluations`;
      const evaluations = await firstValueFrom(
        this.httpClient.get<Page<any>>(evaluationsRoute, { params: { size: 1000 } }).pipe(map(page => page.content))
      );

      console.log('⭐ Avaliações encontradas:', evaluations);

      // 4. Combinar critérios com avaliações existentes - CORRIGIDO: ATRIBUIR AO this.criteriaEvaluations
      this.criteriaEvaluations = criteria.map(criterion => {
        const evaluation = evaluations.find(e =>
          e.criterionId === criterion.id && this.project && e?.project?.id === this.project.id
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
    // Remover o breadcrumb do projeto antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}/projeto/${this.projectId}`);
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
