import { AllocationService } from './../../../../service/allocation.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';
import { TableComponent } from '../../../../components/table/table.component';
import { ResourcesPositionComponent } from '../../resources-position/resources-position.component';
import { ResourcesRequestComponent } from '../../resources-request/resources-request.component';
import { ResourcePoolComponent } from '../resources-pool.component';
import { FormField, FormModalConfig } from '../../../../interface/interfacies';
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import { map, Observable, retry, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourcesService } from '../../../../service/resources.service';
import { ResourceCreateDTO, ResourceReadDTO } from '../../../../interface/resources-interface';
import { ResourcesCreateComponent } from '../../../../components/resources-create/resources-create.component';
import { PoolGraphicComponent } from '../pool-graphic/pool-graphic.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../../models/pagination-models';
import { mapAllocationRequestReadDTOPageToTableRowPage } from '../../../../mappers/allocation-request-mappers';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './allocation-config';
import { get } from 'http';
import { AllocationRequestService } from '../../../../service/allocation-request.service';
import { mapAllocationReadDTOPageToTableRowPage } from '../../../../mappers/allocation-mappers';
import { ProjetoService } from '../../../../service/projeto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resources-detail',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    FormModalComponentComponent,
    PoolGraphicComponent,
    CommonModule,
    TableComponent,
    FormsModule,
    ResourcesCreateComponent,
    SvgIconComponent
  ],
  templateUrl: './resources-detail.component.html',
  styleUrl: './resources-detail.component.scss'
})
export class ResourcesDetailComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  createResourcesConfig: FormModalConfig = {
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
  cancelProjectConfig: FormModalConfig = {
    title: 'Todas alocações não concluídas deste recurso também serão canceladas.Esta ação não é reversível.',
    fields: []
  };
  breadcrumbService = inject(BreadcrumbService);
  resourceService = inject(ResourcesService);
  allocationRequestService = inject(AllocationRequestService);
  allocationService = inject(AllocationService);
  projetoService = inject(ProjetoService);
  router = inject(Router);
  route = inject(ActivatedRoute)
  showCreateModal = false;
  resourceId:number = 0;
  resource: ResourceReadDTO | null = null;
  isChartTab = true;
  resourceName: string= 'all';
  selectedProject = 'all';
  projectsList: { id: number, name: string }[] = [];
  startDate: string;
  endDate: string;
  statusFilter = 'ACTIVE';
  showCancelModal = false;

  columns = getColumns();
  filterButtons = getFilterButtons();
  filterText = getFilterText();
  private routeSubscription?: Subscription;



  constructor() {
    this.loadProjectsList();

    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.endDate = sevenDaysLater.toISOString().split('T')[0];

  }


  ngOnInit(): void {
  // Escutar mudanças nos parâmetros da rota para recarregar quando voltar
  this.routeSubscription = this.route.paramMap.subscribe(params => {
    const estrategiaIdParam = params.get('resourceId');
    this.resourceId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;

    if (this.resourceId) {
      this.loadResourceDetail(this.resourceId);
    }
  });
}

  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => {

    const projectId = this.selectedProject !== 'all' ? Number(this.selectedProject) : undefined;

    return this.allocationService.getAllocationsPage(
      queryParams,
      queryParams?.filterTextQueryParam?.value || '', // searchQuery
      this.startDate,
      this.endDate,
      undefined, // status - não passar para evitar erro, usar default do backend
      false, // includeDisabled
      this.resourceId,
      projectId
      ).pipe(
        map(page => (mapAllocationReadDTOPageToTableRowPage(page)))
      );
  };

  loadProjectsList(): void {
    this.projetoService.getProjectsUnpaged().subscribe({
      next: (projects) => {
        this.projectsList = projects.map(p => ({ id: p.id, name: p.name }));
      },
      error: (err) => {
        console.error('Erro ao carregar lista de projetos:', err);
      }
    });
  }
  loadResourceDetail(resourceId: number): void {
    this.resourceService.getResourceById(resourceId)
      .pipe(retry(3))
      .subscribe({
        next: (resource) => {
          this.resource = resource;
          this.resourceName = resource.id.toString();
          console.log('Recurso carregado:', resource);
          this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Recursos', url: '/recursos', isActive: false },
            { label: `Recurso: ${resource.name}` || 'Recurso', url: `/recursos/${this.resourceId}`, isActive: true }
          ]);

          // COMPONENTE PAI: Remove breadcrumbs filhos quando volta ao foco somente se necessário
          const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
          if (currentBreadcrumbs.length > 3) { // Só remove se tiver mais que [Início, Recursos, Recurso Atual]
            this.breadcrumbService.removeChildrenAfter(`/recursos/${this.resourceId}`);
          }
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do recurso:', err);
          this.router.navigate(['/recursos']);
        }
      });
  }

  openCreateModal(): void {
    // Reset form values
    this.createResourcesConfig.fields.forEach(field => {
      field.value = '';
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCreateModal = true;
  }



  goBack(): void {
    this.router.navigate(['/recursos']);
  }

  switchTab(isChart: boolean): void {
    this.isChartTab = isChart;
  }


  onFilterChange(): void {
    // Lógica para aplicar filtros
    console.log('Filtros aplicados:', {
      resource: this.resourceName,
      project: this.selectedProject,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.statusFilter
    });
    if (this.tableComponent) {
      this.tableComponent.refresh();
    }
  }
  openCancelModal(): void {

    // this.showCancelModal = true;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title:  "Está ação não é reversível",
      text: "Todas alocações não concluídas deste recurso também serão canceladas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancelResource();
        swalWithBootstrapButtons.fire({
          text: "Recurso cancelado.",
          icon: "success"
        });
      }
    });
  }
  closeCancelModal(): void {
    this.showCancelModal = false;
  }
  onCancelResource(): void {
    if (!this.resource) return;


    this.resourceService.disableResource(this.resource.id)
    .pipe(retry(3))
    .subscribe({
      next: (updatedResource) => {
        this.closeCancelModal();
        this.loadResourceDetail(this.resource!.id);
        setTimeout(() => {
          this.router.navigate(['/recursos']);
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao cancelar projeto:', err);
        console.error('Detalhes do erro:', err.error);
        alert('Erro ao cancelar o projeto. Tente novamente.');
      }
    });
  }
}
