import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScenariosTableRow } from '../../interface/carlos-interfaces';
import { ScenarioService } from '../../service/scenario-service';
import { ScenarioCreateModal } from '../scenario-create-modal/scenario-create-modal.component';
import { map, Observable } from 'rxjs';
import { getColumns, getFilterButtons, getFilterText, getActionButton } from './scenario-tab-table-config';
import { TableComponent } from '../table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { mapScenarioPageDtoToScenariosTableRowPage } from '../../mappers/scenario-mappers';

@Component({
  selector: 'app-scenario-tab',
  imports: [
    CommonModule,
    FormsModule,
    ScenarioCreateModal,
    TableComponent
  ],
  templateUrl: './scenario-tab.component.html',
  styleUrl: './scenario-tab.component.scss'
})
export class ScenarioTabComponent {
    @ViewChild(ScenarioCreateModal) createModal!: ScenarioCreateModal;

    strategyId = -1;

    route = inject(ActivatedRoute);
    router = inject(Router);
    scenarioService = inject(ScenarioService);

    showCreateModal = false;

    filterButtons = getFilterButtons();
    filterText = getFilterText();
    columns = getColumns();
    actionButton = getActionButton();

    ngOnInit() {
        this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    }

    openCreateModal(): void {
        this.showCreateModal = true;
        this.createModal.restartForm();
    }

    openScenario(scenariosTableRow: ScenariosTableRow) {
        this.router.navigate(['/estrategia', this.strategyId, 'cenario', scenariosTableRow.id]);
    }

    closeCreateModal(): void {
        this.showCreateModal = false;
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela de cenários, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.scenarioService.getScenariosPage(this.strategyId, queryParams).pipe(
            map(page => (mapScenarioPageDtoToScenariosTableRowPage(page)))
        )
    );

}
