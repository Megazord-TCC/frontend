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
import { getActionButton, getColumns, getFilterButtons, getFilterText } from './cargos-table-config';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { mapPositionReadDTOPageToResourcesPositionTableRowPage } from '../../../mappers/carga-mappers';
import { CargosService } from '../../../service/cargos.service';

@Component({
  selector: 'resources-position',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ResourcesCreateComponent,
    FormModalComponentComponent
  ],
  templateUrl: './resources-position.component.html',
  styleUrl: './resources-position.component.scss'
})
export class ResourcesPositionComponent {
  createProjectConfig: FormModalConfig = {
      title: 'Cadastrar novo cargo',
      fields: [
        {
          id: 'name',
          label: 'Nome',
          type: 'text',
          value: '',
          required: true,
          placeholder: 'Digite o nome do cargo'
        }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
    };
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  showCreateModal = false;
  private routeSubscription?: Subscription;
  private route = inject(ActivatedRoute);
  riskService = inject(CarlosPortfolioRisksService);
  cargoService = inject(CargosService);
  router = inject(Router);
  portfolioId = 0;
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();
  filterButtons = getFilterButtons();



  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
      this.cargoService.getPositionsPage(queryParams).pipe(
          map(page => (mapPositionReadDTOPageToResourcesPositionTableRowPage(page)))
      )
  );
  closeCreateModal() {
    this.createProjectConfig.fields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {} as any);
      this.showCreateModal = false;
  }
  onSavePosition(event: any) {
    const positionData = this.createProjectConfig.fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    console.log('Salvar cargo:', positionData);
    this.cargoService.createPosition(positionData).subscribe({
      next: (createdPosition) => {
        console.log('Cargo criado com sucesso:', createdPosition);
        this.showCreateModal = false;
        this.tableComponent.refresh();
        this.resetFormFields(this.createProjectConfig);
      },
      error: (error) => {
        console.error('Erro ao criar cargo:', error);
      }
    });
  }

  openPosition(event: any): void {
    this.router.navigate([`/recurso/position/${event.id}`]);
  }

  resetFormFields(formConfig: any): void {
    if (formConfig && formConfig.fields) {
      formConfig.fields.forEach((field: any) => {
        field.value = '';
      });
    }
  }

}
