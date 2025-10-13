import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PoolGraphicComponent } from "./pool-graphic/pool-graphic.component";
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../components/table/table.component';
import { ResourcesService } from '../../../service/resources.service';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { FormsModule } from '@angular/forms';
import { mapResourceReadDTOPageToResourcesPositionTableRowPage } from '../../../mappers/resources-mappers';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './resources-table-config';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { FormField, FormModalConfig } from '../../../interface/interfacies';
import { ResourcesCreateComponent } from '../../../components/resources-create/resources-create.component';
import { Router } from '@angular/router';


@Component({
  selector: 'resources-pool',
  templateUrl: './resources-pool.component.html',
  styleUrl: './resources-pool.component.scss',
  imports: [
    PoolGraphicComponent,
    CommonModule,
    TableComponent,
    FormsModule,
    ResourcesCreateComponent
]
})
export class ResourcePoolComponent {
  @ViewChild('tableComponent') tableComponent!: TableComponent;

  createResourceConfig: FormModalConfig = {
    title: 'Cadastrar novo recurso',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome do recurso'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição do recurso',
        rows: 4
      },
      {
        id: 'dailyHours',
        label: 'Horas/dia contrato',
        type: 'number',
        value: '',
        required: true,
        placeholder: 'Ex: 8'
      },
      {
        id: 'positionId',
        label: 'Cargo',
        type: 'number', // ideal seria um select, mas depende dos cargos disponíveis
        value: '',
        required: true,
        placeholder: 'ID do cargo'
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  isChartTab = true;
  resourcesService = inject(ResourcesService);
  router = inject(Router);
  // Filtros
  selectedResource = 'all';
  resourcesList: { id: number, name: string }[] = [];
  selectedProject = 'all';
  startDate = '2025-01-01';
  endDate = '2026-01-01';
  statusFilter = 'ACTIVE';

  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();
  filterButtons = getFilterButtons();


  showCreateModal = false;

  constructor() {
    this.loadResourcesList();
  }

  loadResourcesList(): void {
    this.resourcesService.getResourcesUnpaged().subscribe({
      next: (resources) => {
        this.resourcesList = resources.map(r => ({ id: r.id, name: r.name }));
      },
      error: (err) => {
        console.error('Erro ao carregar lista de recursos:', err);
      }
    });
  }



  switchTab(isChart: boolean): void {
    this.isChartTab = isChart;
  }

  onFilterChange(): void {
    // Lógica para aplicar filtros
    console.log('Filtros aplicados:', {
      resource: this.selectedResource,
      project: this.selectedProject,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.statusFilter
    });
  }

  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
    this.resourcesService.getResourcesPage(
      queryParams,
      this.startDate,
      this.endDate,
      this.statusFilter ? this.statusFilter : 'ACTIVE,INACTIVE'
    ).pipe(
      map(page => (mapResourceReadDTOPageToResourcesPositionTableRowPage(page)))
    )
  );




  closeCreateModal(): void {
    this.tableComponent.refresh();
    this.showCreateModal = false;
  }
  onSaveProject(fields: FormField[]): void {
    const projectData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);






    function formatDateBR(dateStr?: string): string {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // já está formatada
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const newResource = {
      name: projectData.name,
      description: projectData.description,
      dailyHours: Number(projectData.dailyHours),
      positionId: Number(projectData.positionId)
    };

    console.log('Dados do recurso sendo enviados:', newResource);

    this.resourcesService.createResource(newResource).subscribe({
      next: (createdResource) => {
        console.log('Recurso criado:', createdResource);

        this.closeCreateModal();
        if (this.tableComponent) {
          this.tableComponent.refresh();
        }
      },
      error: (err) => {
        console.error('Erro completo ao criar recurso:', err);
      }
    });
  }
  goToResourceDetail(id: number | { id: number }): void {
    console.log('Recurso clicado:', id);
    let resourceId: number | undefined;
    if (typeof id === 'object' && id !== null && 'id' in id) {
      resourceId = id.id;
    } else if (typeof id === 'number') {
      resourceId = id;
    }
    if (resourceId) {
      this.router.navigate(['/recurso', resourceId]);
    } else {
      console.warn('ID da estratégia não encontrado:', resourceId);
    }
  }
}


