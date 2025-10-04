import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../components/form-modal-component/form-modal-component.component';
import { ResourcesCreateComponent } from '../../../components/resources-create/resources-create.component';
import { SvgIconComponent } from '../../../components/svg-icon/svg-icon.component';
import { TableComponent } from '../../../components/table/table.component';
import { FormModalConfig } from '../../../interface/interfacies';
import { map, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CarlosPortfolioRisksService } from '../../../service/carlos-portfolio-risks.service';
import { getActionButton, getColumns, getFilterText } from './cargos-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { mapPositionReadDTOPageToResourcesPositionTableRowPage } from '../../../mappers/carga-mappers';

@Component({
  selector: 'resources-position',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ResourcesCreateComponent
  ],
  templateUrl: './resources-position.component.html',
  styleUrl: './resources-position.component.scss'
})
export class ResourcesPositionComponent {
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
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();

   getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.riskService.getPortfolioRisksPage(this.portfolioId, queryParams).pipe(
            map(page => (mapPositionReadDTOPageToResourcesPositionTableRowPage(page)))
        )
    );
    closeCreateModal() {
        this.showCreateModal = false;
    }
}
