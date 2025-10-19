import { Component, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from '../card/card.component';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationGroup, CriteriaGroup } from '../../interface/carlos-interfaces';
import { forkJoin, map, Observable } from 'rxjs';
import { EvaluationGroupCreateModal } from '../evaluation-group-create-modal/evaluation-group-create-modal.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { CriteriaGroupService } from '../../service/criteria-group.service';
import { mapCriteriaGroupPageDtoToCriteriaGroupTableRowPage } from '../../mappers/criteria-group-mappers';
import { TableComponent } from '../table/table.component';
import { get } from 'http';
import { getActionButton, getEvaluationColumns, getEvaluationFilterButtons, getEvaluationFilterText } from './evaluation-groups-table.config';
import { EvaluationService } from '../../service/evaluation.service';
import { mapEvaluationGroupPageDtoToEvaluationGroupTableRowPage } from '../../mappers/evaluation-mappers';

@Component({
  selector: 'app-evaluation-groups-tab',
  imports: [
    CommonModule,
    CardComponent,
    SvgIconComponent,
    FormsModule,
    EvaluationGroupCreateModal,
    TableComponent
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
    constructor(
      private criterioService: CriteriaGroupService,
      private evaluationService: EvaluationService
    ) {}
    evaluationGroups: EvaluationGroup[] = [];
    filteredEvaluationGroups: EvaluationGroup[] = [];

    evaluationSearchTerm = "";

    showCreateModal = false;

    evaluationColumns= getEvaluationColumns();
    evaluationFilterText = getEvaluationFilterText();
    evaluationFilterButtons = getEvaluationFilterButtons();
    evaluationActionButton = getActionButton();

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
    onSaved(): void {
      this.showCreateModal = false;
      this.setEvaluationGroupsByHttpRequest();
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

    getDataForEvaluationTable: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {
        return this.evaluationService.getEvaluationGroupsPage(this.strategyId, queryParams).pipe(
            map(page => {
                console.log('[LOG] Retorno da API getEvaluationGroupsPage:', page);
                return mapEvaluationGroupPageDtoToEvaluationGroupTableRowPage(page);
            })
        );
    };
    setEvaluationGroupsByHttpRequest() {
        let evaluationGroupsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups`;

        this.httpClient.get<Page<EvaluationGroup>>(evaluationGroupsRoute, { params: { size: 1000 } })
            .pipe(map(page => page.content))
            .subscribe(evaluationGroups => {
                this.evaluationGroups = evaluationGroups;
                this.filteredEvaluationGroups = evaluationGroups;
            });
    }
}
