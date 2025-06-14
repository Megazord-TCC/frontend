import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { CardComponent } from '../../../components/card/card.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { EvaluationGroupsTabComponent } from '../../../components/evaluation-groups-tab/evaluation-groups-tab.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CriteriaGroup, Evaluation, EvaluationGroup, EvaluationGroupView, ProjectRanking, User } from '../../../interface/carlos-interfaces';
import { filter, forkJoin, map, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-evaluation-group-detail-page',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    FormModalComponentComponent,
    EvaluationGroupsTabComponent
  ],
  templateUrl: './evaluation-group-detail-page.component.html',
  styleUrl: './evaluation-group-detail-page.component.scss'
})
export class EvaluationGroupDetailPageComponent {

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);

  strategyId = -1;
  evaluationGroupId = -1;

  evaluationGroup: EvaluationGroupView | undefined;
  
  projectRankings: ProjectRanking[] = [];
  filteredProjectRankings: ProjectRanking[] = [];

  searchTerm = '';

  showCreateModal = false;

  ngOnInit(): void {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    this.evaluationGroupId = Number(this.route.snapshot.paramMap.get('grupoAvaliacaoId'));
    this.setCurrentEvaluationGroupByHttpRequest();
    this.setProjectRankingsByHttpRequest();
  }

  setCurrentEvaluationGroupByHttpRequest() {
      let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps`;
      let criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;

      let getAllEvaluationGroups$ = this.httpClient.get<EvaluationGroup[]>(evaluationGroupsRoute);
      let getAllCriteriaGroups$ = this.httpClient.get<CriteriaGroup[]>(criteriaGroupsRoute);

      forkJoin({ evaluationGroups: getAllEvaluationGroups$, criteriaGroups: getAllCriteriaGroups$ })
        .pipe(
          map(({ evaluationGroups, criteriaGroups }) => this.getManyEvaluationGroupView(evaluationGroups, criteriaGroups)),
          map(evaluationGroups => evaluationGroups.find(evaluationGroup => evaluationGroup.id == this.evaluationGroupId))
        )
        .subscribe(evaluationGroup => this.evaluationGroup = evaluationGroup);
  }

  getManyEvaluationGroupView(evaluationGroups: EvaluationGroup[], criteriaGroups: CriteriaGroup[]): EvaluationGroupView[] {
      return evaluationGroups.map(evaluationGroup => ({
          ...evaluationGroup,
          criteriaGroup: criteriaGroups.find(criteriaGroup => criteriaGroup.id == evaluationGroup.criteriaGroupId)
      }));
  }

  setProjectRankingsByHttpRequest() {
    let projectRankingsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/ranking`;
    let getAllProjectRankings$ =  this.httpClient.get<ProjectRanking[]>(projectRankingsRoute);

    getAllProjectRankings$.subscribe(projectRankings => { 
      this.projectRankings = projectRankings;
      this.filteredProjectRankings = projectRankings;
    });
  }

  goToStrategiesPage() {
    this.router.navigate(['/estrategias']);
  }

  goToHomePage() {
    this.router.navigate(['/inicio']);
  }

  goBack(): void {
    this.router.navigateByUrl(`estrategia/${this.strategyId}`);
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  emptyMethod() { }

  openCreateModal() {

  }

  openEvaluationModal(projectRanking: ProjectRanking) {

  }
}
