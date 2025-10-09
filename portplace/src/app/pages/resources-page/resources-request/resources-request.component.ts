import { Component, inject, ViewChild } from '@angular/core';
import { FormModalConfig } from '../../../interface/interfacies';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { TableComponent } from '../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { map, Observable, Subscription } from 'rxjs';
import { CarlosPortfolioRisksService } from '../../../service/carlos-portfolio-risks.service';
import { mapRiskReadDTOPageToPortfolioRisksTableRowPage } from '../../../mappers/carlos-risks-mappers';
import { ActivatedRoute, Router } from '@angular/router';

import { ResourcesCreateComponent } from '../../../components/resources-create/resources-create.component';
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './request-allocation-config';
@Component({
  selector: 'resources-request',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ResourcesCreateComponent
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
  riskService = inject(CarlosPortfolioRisksService);
  router = inject(Router);
  portfolioId = 0;
  filterButtons = getFilterButtons(); 
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();

  async ngOnInit() {
      this.routeSubscription = this.route.paramMap.subscribe(async params => {
          this.portfolioId = Number(params.get('id'));
      });
  }
  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
      this.riskService.getPortfolioRisksPage(this.portfolioId, queryParams).pipe(
          map(page => (mapRiskReadDTOPageToPortfolioRisksTableRowPage(page)))
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
