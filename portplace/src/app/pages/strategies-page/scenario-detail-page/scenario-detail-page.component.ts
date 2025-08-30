import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { EvaluationGroupEditModal } from '../../../components/evaluation-group-edit-modal/evaluation-group-edit-modal.component';
import { ProjectEvaluationCreateModal } from '../../../components/evaluation-project-create-modal/evaluation-project-create-modal.component';
import { HttpClient } from '@angular/common/http';
import { CriteriaGroup, EvaluationGroup, EvaluationGroupView, ProjectRanking, Scenario, ScenarioProject } from '../../../interface/carlos-interfaces';
import { Subscription } from 'rxjs';
import { EvaluationGroupDeleteModal } from '../../../components/evaluation-group-delete-modal/evaluation-group-delete-modal.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { ScenarioService } from '../../../service/scenario-service';

@Component({
    selector: 'app-scenario-detail-page',
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
    templateUrl: './scenario-detail-page.component.html',
    styleUrl: './scenario-detail-page.component.scss'
})
export class ScenarioDetailPageComponent {
    // private routeSubscription?: Subscription;

    // httpClient = inject(HttpClient);
    // route = inject(ActivatedRoute);
    // router = inject(Router);
    // breadcrumbService = inject(BreadcrumbService);
    // scenarioService = inject(ScenarioService);

    // strategyId = -1;
    // scenarioId = -1;

    // scenario: Scenario | undefined;

    // filteredScenarioProjects: ScenarioProject[] = [];

    // searchTerm = '';

    // showCreateModal = false;
    // showEditModal = false;
    // showDeleteModal = false;

    // ngOnInit(): void {
    //     // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
    //     this.routeSubscription = this.route.paramMap.subscribe(params => {
    //         this.strategyId = Number(params.get('estrategiaId'));
    //         this.scenarioId = Number(params.get('cenarioId'));

    //         this.setCurrentScenarioByHttpRequest();
    //     });
    // }

    // ngOnDestroy(): void {
    //     if (this.routeSubscription) {
    //         this.routeSubscription.unsubscribe();
    //     }
    // }

    // setCurrentScenarioByHttpRequest() {
    //     this.scenarioService.getScenarioDetailsById(this.scenarioId).subscribe(scenario => {
    //         this.scenario = scenario;

    //         if (scenario)
    //             this.addChildBreadcrumb(scenario);
    //     });
    // }

    // addChildBreadcrumb(scenario: Scenario) {
    //     this.breadcrumbService.addChildBreadcrumb({
    //         label: scenario.name,
    //         url: `/estrategia/${this.strategyId}/cenario/${this.scenarioId}`,
    //         isActive: true
    //     });
    // }

    // getManyEvaluationGroupView(evaluationGroups: EvaluationGroup[], criteriaGroups: CriteriaGroup[]): EvaluationGroupView[] {
    //     return evaluationGroups.map(evaluationGroup => ({
    //         ...evaluationGroup,
    //         criteriaGroup: criteriaGroups.find(criteriaGroup => criteriaGroup.id == evaluationGroup.criteriaGroupId)
    //     }));
    // }

    // goToStrategiesPage() {
    //     this.router.navigate(['/estrategias']);
    // }

    // goToHomePage() {
    //     this.router.navigate(['/inicio']);
    // }

    // goBack(): void {
    //     // Remover o breadcrumb do grupo de avaliação antes de navegar
    //     this.breadcrumbService.removeBreadcrumbByUrl(`/estrategia/${this.strategyId}/cenario/${this.scenarioId}`);
    //     this.router.navigateByUrl(`estrategia/${this.strategyId}`);
    // }

    // // Modal de criação de avaliação de projeto
    // openCreateModal() {
    //     this.showCreateModal = true;
    // }

    // closeCreateModal(): void {
    //     this.showCreateModal = false;
    // }

    // onProjectEvaluationCreated(): void {
    //     this.setProjectRankingsByHttpRequest(); // Recarrega a lista
    // }

    // // Modal de edição do grupo de avaliação
    // openEditModal() {
    //     this.showEditModal = true;
    // }

    // closeEditModal(): void {
    //     this.showEditModal = false;
    // }

    // onEvaluationGroupUpdated(): void {
    //     this.setCurrentEvaluationGroupByHttpRequest(); // Recarrega os dados
    // }

    // // Modal de exclusão do grupo de avaliação - CORRIGIDO
    // openDeleteModal(): void {

    //     this.showDeleteModal = true;
    // }

    // closeDeleteModal(): void {

    //     this.showDeleteModal = false;
    // }

    // onEvaluationGroupDeleted(): void {

    //     // Redirecionar para a página de estratégias após exclusão
    //     this.router.navigateByUrl(`estrategia/${this.strategyId}`);
    // }

    // // Método para abrir modal de avaliação individual do projeto
    // openEvaluationModal(projectRanking: ProjectRanking) {
    //     console.log('Redirecionando para avaliação do projeto:', projectRanking);
    //     console.log('Dados do projeto:', {
    //         projectId: projectRanking.projectId,
    //         name: projectRanking.name,
    //         position: projectRanking.position,
    //         totalScore: projectRanking.totalScore
    //     });
    // }

    // // Método para filtrar projetos com base na busca
    // onSearchChange(): void {
    //     if (!this.searchTerm.trim()) {
    //         this.filteredProjectRankings = this.projectRankings;
    //     } else {
    //         this.filteredProjectRankings = this.projectRankings.filter(project =>
    //             project.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    //         );
    //     }
    // }
    // formatScoreBR(score: number): string {
    //     if (score == null || score === undefined || isNaN(score)) {
    //         return '0,00';
    //     }
    //     return score.toFixed(2).replace('.', ',');
    // }
}
