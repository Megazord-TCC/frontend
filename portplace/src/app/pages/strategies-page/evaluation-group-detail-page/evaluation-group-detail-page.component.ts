import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { EvaluationGroupEditModal } from '../../../components/evaluation-group-edit-modal/evaluation-group-edit-modal.component';
import { ProjectEvaluationCreateModal } from '../../../components/evaluation-project-create-modal/evaluation-project-create-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CriteriaGroup, EvaluationGroup, ProjectRanking } from '../../../interface/carlos-interfaces';
import { forkJoin, map, Subscription } from 'rxjs';
import { EvaluationGroupDeleteModal } from '../../../components/evaluation-group-delete-modal/evaluation-group-delete-modal.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { Page } from '../../../models/pagination-models';

@Component({
  selector: 'app-evaluation-group-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    SvgIconComponent,
    EvaluationGroupEditModal,
    ProjectEvaluationCreateModal,
    EvaluationGroupDeleteModal,
    BreadcrumbComponent
  ],
  templateUrl: './evaluation-group-detail-page.component.html',
  styleUrl: './evaluation-group-detail-page.component.scss'
})
export class EvaluationGroupDetailPageComponent implements OnInit, OnDestroy {
  private routeSubscription?: Subscription;

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  breadcrumbService = inject(BreadcrumbService);

  strategyId = -1;
  evaluationGroupId = -1;

  evaluationGroup: EvaluationGroup | undefined;

  projectRankings: ProjectRanking[] = [];
  filteredProjectRankings: ProjectRanking[] = [];

  searchTerm = '';

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.strategyId = Number(params.get('estrategiaId'));
      this.evaluationGroupId = Number(params.get('grupoAvaliacaoId'));

      // COMPONENTE FILHO: Recarregar dados quando parâmetros mudam
      console.log('📍 Componente filho: Grupo de Avaliação inicializando/recarregando');

      this.setCurrentEvaluationGroupByHttpRequest();
      this.setProjectRankingsByHttpRequest();
    });
  }

  ngOnDestroy(): void {
    // Limpar subscription para evitar memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private setupBreadcrumbs(): void {
    // Usar buildChildBreadcrumbs para construir baseado no pai atual
    // O breadcrumb do grupo será adicionado quando os dados estiverem carregados
    console.log('📍 Configurando breadcrumbs para grupo de avaliação');
  }

  setCurrentEvaluationGroupByHttpRequest() {
    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;

    this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } })
        .pipe(map(page => page.content))
        .subscribe(evaluationGroups => {
            this.evaluationGroup = evaluationGroups.find(evaluationGroup => evaluationGroup.id == this.evaluationGroupId);

            // Usar addChildBreadcrumb para adicionar breadcrumb filho
            if (this.evaluationGroup)
            this.breadcrumbService.addChildBreadcrumb({
                label: this.evaluationGroup.name,
                url: `/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}`,
                isActive: true
            });
        });
  }

  setProjectRankingsByHttpRequest() {
    let projectRankingsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups/${this.evaluationGroupId}/ranking`;
    let getAllProjectRankings$ =  this.httpClient.get<ProjectRanking[]>(projectRankingsRoute);
    getAllProjectRankings$.subscribe(projectRankings => {
      this.projectRankings = projectRankings;
      this.filteredProjectRankings = projectRankings;
      console.log('📍 Retorno dos rankings de projetos:', projectRankings);
    });
  }

  goToStrategiesPage() {
    this.router.navigate(['/estrategias']);
  }

  goToHomePage() {
    this.router.navigate(['/inicio']);
  }

  goBack(): void {
    // Remover o breadcrumb do grupo de avaliação antes de navegar
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}`);
    this.router.navigateByUrl(`estrategia/${this.strategyId}`);
  }

  // Modal de criação de avaliação de projeto
  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onProjectEvaluationCreated(): void {
    this.setProjectRankingsByHttpRequest(); // Recarrega a lista
  }

  // Modal de edição do grupo de avaliação
  openEditModal() {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEvaluationGroupUpdated(): void {
    this.setCurrentEvaluationGroupByHttpRequest(); // Recarrega os dados
  }

  // Modal de exclusão do grupo de avaliação - CORRIGIDO
  openDeleteModal(): void {

    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {

    this.showDeleteModal = false;
  }

  onEvaluationGroupDeleted(): void {

    // Redirecionar para a página de estratégias após exclusão
    this.router.navigateByUrl(`estrategia/${this.strategyId}`);
  }

  // Método para abrir modal de avaliação individual do projeto
  openEvaluationModal(projectRanking: ProjectRanking) {
    console.log('Redirecionando para avaliação do projeto:', projectRanking);
    console.log('Dados do projeto:', {
      projectId: projectRanking.projectId,
      name: projectRanking.name,
      position: projectRanking.position,
      totalScore: projectRanking.totalScore
    });

    // Navegar para a página de avaliação do projeto
    this.router.navigate([
      `/estrategia/${this.strategyId}/grupo-avaliacao/${this.evaluationGroupId}/projeto/${projectRanking.projectId}`
    ]);
  }

  // Método para filtrar projetos com base na busca
  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProjectRankings = this.projectRankings;
    } else {
      this.filteredProjectRankings = this.projectRankings.filter(project =>
        project.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  formatScoreBR(score: number): string {
    if (score == null || score === undefined || isNaN(score)) {
      return '0,00';
    }
    return score.toFixed(2).replace('.', ',');
  }
}
