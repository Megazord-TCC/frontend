import { Component, inject, ViewChild } from '@angular/core';
import { FormModalConfig } from '../../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { map, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './request-allocation-config';
import { ResourcesAllocationRequestComponent } from '../../../components/resources-allocation-request/resources-allocation-request.component';
import { AllocationRequestService } from '../../../service/allocation-request.service';
import { mapAllocationRequestReadDTOPageToTableRowPage } from '../../../mappers/allocation-request-mappers';
@Component({
  selector: 'resources-request',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ResourcesAllocationRequestComponent
],
  templateUrl: './resources-request.component.html',
  styleUrl: './resources-request.component.scss'
})
export class ResourcesRequestComponent {
  createProjectConfig: FormModalConfig = {
      title: 'Cadastrar novo projeto',
      fields: [
        {
          id: 'name',
          label: 'Nome',
          type: 'text',
          value: '',
          required: true,
          placeholder: 'Digite o nome do projeto'
        },
        {
          id: 'description',
          label: 'Descrição',
          type: 'textarea',
          value: '',
          required: false,
          placeholder: 'Digite a descrição do projeto',
          rows: 4
        },
        {
          id: 'startDate',
          label: 'Início planejado',
          type: 'date',
          value: '',
          required: true
        },
        {
          id: 'endDate',
          label: 'Fim planejado',
          type: 'date',
          value: '',
          required: true
        }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    };
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  showCreateModal = false;
  private routeSubscription?: Subscription;
  private route = inject(ActivatedRoute);
  allocationRequestService = inject(AllocationRequestService);
  router = inject(Router);
  portfolioId = 0;
  filterButtons = getFilterButtons();
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();

  selectedProject = 'all';

  statusFilter = 'ACTIVE';

  async ngOnInit() {
      this.routeSubscription = this.route.paramMap.subscribe(async params => {
          this.portfolioId = Number(params.get('id'));
      });
  }

  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
    this.allocationRequestService.getAllocationRequestPage(
      queryParams,
    ).pipe(
      map(page => mapAllocationRequestReadDTOPageToTableRowPage(page))
    )
  );
  closeCreateModal(): void {
      this.showCreateModal = false;
      this.tableComponent.refresh();
  }
  onSaveRisk(): void {
    this.showCreateModal = true;

  }
  openResource(event: any): void {
    this.router.navigate([`/portfolio/${this.portfolioId}/recurso/${event.id}`]);
  }
}
