import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth-service';
import { FormModalConfig } from '../../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { PageType, Role } from '../../../interface/carlos-auth-interfaces';
import { map, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './request-allocation-config';
import { ResourcesAllocationRequestComponent } from '../../../components/resources-allocation-request/resources-allocation-request.component';
import { AllocationRequestService } from '../../../service/allocation-request.service';
import { mapAllocationRequestReadDTOPageToTableRowPage } from '../../../mappers/allocation-request-mappers';
import { ResourcesAllocationCreateComponent } from '../../../components/resources-allocation-create/resources-allocation-create.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'resources-request',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ResourcesAllocationRequestComponent,
    ResourcesAllocationCreateComponent
],
  templateUrl: './resources-request.component.html',
  styleUrl: './resources-request.component.scss'
})
export class ResourcesRequestComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly allocationRequestService = inject(AllocationRequestService);
  private readonly router = inject(Router);
  role = Role;
  isPMO = false;
  isProjectManager = false;
  selectedAllocationRequestId: number = 0;
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
  showAllocationModal = false;
  filterButtons = getFilterButtons();
  filterText = getFilterText();
  columns: any[] = [];
  actionButton: any = undefined;
  selectedProject = 'all';
  statusFilter = 'ACTIVE';

  ngOnInit(): void {
    this.isPMO = this.authService.roleFrontend == Role.PMO || this.authService.roleFrontend == Role.PMO_ADM;
    this.isProjectManager = this.authService.roleFrontend == Role.PROJECT_MANAGER;
    if (this.isProjectManager) {
      this.actionButton = getActionButton();
    }

    this.columns = getColumns(this.isPMO);
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
  closeAllocationModal(): void {
      this.showAllocationModal = false;
      this.tableComponent.refresh();
  }
  openResource(event: any): void {
    if (this.isPMO) {
      if (event.status === 'CANCELADO') {
        Swal.fire({
          title: 'Ação não permitida',
          text: 'Não é possível alocar um pedido cancelado.',
          icon: 'warning',
          confirmButtonText: 'Entendi'
        });
        return;
      }
      console.log("allocation request id", event.id);
      this.selectedAllocationRequestId = event.id;
      this.showAllocationModal = true;

    }
  }

  handleMainColumnClick(event: any): void {
    if (this.isPMO) {
      this.openResource(event);
    }
  }
}
