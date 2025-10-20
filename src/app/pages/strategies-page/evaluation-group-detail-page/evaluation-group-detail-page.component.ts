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
import { EvaluationGroupApiResponse, Strategy } from '../../../interface/interfacies';
import { EstrategiaService } from '../../../service/estrategia.service';

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
  strategyService = inject(EstrategiaService);
  strategy: Strategy | undefined;

  estrategiaId = -1;
  evaluationGroupId = -1;

  evaluationGroup: EvaluationGroupApiResponse | undefined;

  projectRankings: ProjectRanking[] = [];
  filteredProjectRankings: ProjectRanking[] = [];
  searchTerm = '';

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  ngOnInit(): void {
    // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const estrategiaIdParam = params.get('estrategiaId');
      this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
      this.evaluationGroupId = Number(params.get('grupoAvaliacaoId'));

      this.getStrategyById(this.estrategiaId)
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



  getStrategyById(estrategiaId: number): void {
    this.strategyService.getStrategyById(estrategiaId)
      .subscribe(strategy => {
        this.strategy = strategy;
      });
  }

  setCurrentEvaluationGroupByHttpRequest() {
    let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.estrategiaId}/evaluation-groups`;

    this.httpClient.get<Page<EvaluationGroupApiResponse>>(evaluationGroupsRoute, { params: { size: 1000 } })
        .pipe(map(page => page.content))
        .subscribe(evaluationGroups => {
            this.evaluationGroup = evaluationGroups.find(evaluationGroup => evaluationGroup.id == this.evaluationGroupId);

            // Usar addChildBreadcrumb para adicionar breadcrumb filho
            if (this.evaluationGroup)
            this.breadcrumbService.addChildBreadcrumb({
            label: `Grupo de Avaliação: ${this.evaluationGroup.name}`,
            url: `/estrategia/${this.estrategiaId}/grupo-avaliacao/${this.evaluationGroupId}`,
            isActive: true
          });
          this.breadcrumbService.setBreadcrumbs([
              { label: 'Início', url: '/inicio', isActive: false },
              { label: 'Estratégias', url: '/estrategias', isActive: false },
              { label: `Estratégia: ${this.strategy?.name}` || 'Estratégia', url: `/estrategia/${this.estrategiaId}`, isActive: false },
              { label: `Grupo de Avaliação: ${this.evaluationGroup?.name}` || 'Grupo de Avaliação', url: `/estrategia/${this.estrategiaId}/grupo-avaliacao/${this.evaluationGroupId}`, isActive: true }
            ]);
        });
      }

      setProjectRankingsByHttpRequest() {
        let projectRankingsRoute = `${environment.apiUrl}/strategies/${this.estrategiaId}/evaluation-groups/${this.evaluationGroupId}/ranking`;
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
    this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.estrategiaId}/grupo-avaliacao/${this.evaluationGroupId}`);
    this.router.navigateByUrl(`estrategia/${this.estrategiaId}`);
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

  // Converte string 'dd/MM/yyyy HH:mm:ss' para Date
  public parseDateString(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second = '0'] = timePart.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
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
    this.router.navigateByUrl(`estrategia/${this.estrategiaId}`);
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
      `/estrategia/${this.estrategiaId}/grupo-avaliacao/${this.evaluationGroupId}/projeto/${projectRanking.projectId}`
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
