import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
    ResourcesCreateComponent
  ],
  templateUrl: './resources-detail.component.html',
  styleUrl: './resources-detail.component.scss'
})
export class ResourcesDetailComponent implements OnInit {
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
  breadcrumbService = inject(BreadcrumbService);
  resourceService = inject(ResourcesService);
  router = inject(Router);
  route = inject(ActivatedRoute)
  showCreateModal = false;
  resourceId:number = 0;
  resource: ResourceReadDTO | null = null;
  isChartTab = true;
  selectedResource = 'all';
  resourcesList: { id: number, name: string }[] = [];
  selectedProject = 'all';
  startDate = '2025-01-01';
  endDate = '2026-01-01';
  statusFilter = 'ACTIVE';

  private routeSubscription?: Subscription;



  constructor() {
    this.loadResourcesList();
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

  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
      this.resourceService.getResourcesPage(
        queryParams,
        this.startDate,
        this.endDate,
        this.statusFilter ? this.statusFilter : 'ACTIVE,INACTIVE'
      ).pipe(
        map(page => (mapAllocationRequestReadDTOPageToTableRowPage(page)))
      )
    );


  loadResourceDetail(resourceId: number): void {
    this.resourceService.getResourceById(resourceId)
      .pipe(retry(3))
      .subscribe({
        next: (resource) => {
          this.resource = resource;
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

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSaveProject(fields: FormField[]): void {
    // Process form data
    const projectData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    // this.projetoService.createProject(newProject).subscribe({
    //   next: (createdProject) => {
    //     console.log('Projeto criado:', createdProject);
    //     this.loadResources();
    //     this.resetNewProject();
    //   },
    //   error: (err) => {
    //     console.error('Erro ao criar projeto:', err);
    //   }
    // });
    this.closeCreateModal();
  }

  switchTab(isChart: boolean): void {
    this.isChartTab = isChart;
  }

  loadResourcesList(): void {
    this.resourceService.getResourcesUnpaged().subscribe({
      next: (resources) => {
        this.resourcesList = resources.map(r => ({ id: r.id, name: r.name }));
      },
      error: (err) => {
        console.error('Erro ao carregar lista de recursos:', err);
      }
    });
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


}
