import { Component, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from '../card/card.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationGroup, EvaluationGroupView, CriteriaGroup } from '../../interface/carlos-interfaces';
import { forkJoin, map } from 'rxjs';
import { EvaluationGroupCreateModal } from '../evaluation-group-create-modal/evaluation-group-create-modal.component';
import { Page } from '../../models/pagination-models';

@Component({
  selector: 'app-evaluation-groups-tab',
  imports: [
    CommonModule,
    CardComponent,
    SvgIconComponent,
    FormsModule,
    EvaluationGroupCreateModal
  ],
  templateUrl: './evaluation-groups-tab.component.html',
  styleUrl: './evaluation-groups-tab.component.scss'
})
export class EvaluationGroupsTabComponent {

    @ViewChild(EvaluationGroupCreateModal) createModal!: EvaluationGroupCreateModal;

    strategyId = -1;

    httpClient = inject(HttpClient);
    route = inject(ActivatedRoute);
    router = inject(Router);

    evaluationGroups: EvaluationGroupView[] = [];
    filteredEvaluationGroups: EvaluationGroupView[] = [];

    evaluationSearchTerm = "";

    showCreateModal = false;

    ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
        this.filteredEvaluationGroups = [...this.evaluationGroups];
        this.setEvaluationGroupsByHttpRequest();
    }

    openCreateModal(): void {
        this.showCreateModal = true;
        this.createModal.restartForm();
    }

    openEvaluation(evaluationGroup: EvaluationGroup) {
        this.router.navigate(['/estrategia', this.strategyId, 'grupo-avaliacao', evaluationGroup.id]);
    }

    onSearchChange(): void {
        let filtered = [...this.evaluationGroups];
        filtered = filtered.filter(evaluationGroup =>
            evaluationGroup.name.toLowerCase().includes(this.evaluationSearchTerm.toLowerCase())
        );
        this.filteredEvaluationGroups = filtered;
    }

    closeCreateModal(): void {
        this.showCreateModal = false;
    }

    setEvaluationGroupsByHttpRequest() {
        let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;
        let criteriaGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups`;

        let getAllEvaluationGroups$ = this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
        let getAllCriteriaGroups$ = this.httpClient.get<Page<CriteriaGroup>>(criteriaGroupsRoute, { params: { size: 1000 } }).pipe(map(page => page.content));
      
        forkJoin({ evaluationGroups: getAllEvaluationGroups$, criteriaGroups: getAllCriteriaGroups$ })
            .pipe(map(({ evaluationGroups, criteriaGroups }) => this.getManyEvaluationGroupView(evaluationGroups, criteriaGroups)))
            .subscribe(evaluationGroups => {
                this.evaluationGroups = evaluationGroups;
                this.filteredEvaluationGroups = evaluationGroups;
            });

    }

    getManyEvaluationGroupView(evaluationGroups: EvaluationGroup[], criteriaGroups: CriteriaGroup[]): EvaluationGroupView[] {
        return evaluationGroups.map(evaluationGroup => ({
            ...evaluationGroup,
            criteriaGroup: criteriaGroups.find(criteriaGroup => criteriaGroup.id == evaluationGroup.criteriaGroupId)
        }));
    }

}
