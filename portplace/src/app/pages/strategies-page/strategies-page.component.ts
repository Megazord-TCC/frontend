import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { EstrategiaService } from '../../service/estrategia.service';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { Strategy, StrategyStatusEnum, FormModalConfig, FormField } from '../../interface/interfacies';
import { Observable, retry, map } from 'rxjs';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';
import { mapStrategyPageDtoToStrategyTableRowPage } from '../../mappers/strategies-mappers';
import { TableComponent } from '../../components/table/table.component';
import { getFilterButtons, getFilterText, getColumns, getActionButton } from './strategies-table-config';


@Component({
  selector: 'app-strategies-page',
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    BadgeComponent,
    SvgIconComponent,
    BreadcrumbComponent,
    FormModalComponentComponent,
    TableComponent
  ],
  templateUrl: './strategies-page.component.html',
  styleUrl: './strategies-page.component.scss'
})
export class StrategiesPageComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  filterButtons = getFilterButtons();
  filterText = getFilterText();
  columns = getColumns();
  actionButton = getActionButton();
  private router = inject(Router);
  private breadcrumbService = inject(BreadcrumbService);
  private estrategiaService = inject(EstrategiaService);

  strategies: Strategy[] = [];
  allStrategies: Strategy[] = [];
  filteredStrategies: Strategy[] = [];
  searchTerm = '';
  activeFilter = '';
  showCreateModal = false;
  loadingStrategies = false;

  createStrategyConfig: FormModalConfig = {
    title: 'Cadastrar nova estratégia',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome da estratégia'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição da estratégia',
        rows: 4
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  ngOnInit(): void {
    // COMPONENTE PAI: Configurar breadcrumbs base
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'Início',
        url: '/inicio',
        isActive: false
      },
      {
        label: 'Estratégias',
        url: '/estrategias',
        isActive: true
      }
    ]);

    // COMPONENTE PAI: Remove qualquer breadcrumb filho somente se existir
    const currentBreadcrumbs = this.breadcrumbService.getCurrentBreadcrumbs();
    if (currentBreadcrumbs.length > 2) { // Só remove se tiver mais que [Início, Estratégias]
      this.breadcrumbService.removeChildrenAfter('/estrategias');
    }

  }

  // Usado pelo TableComponent.
  // Recarrega a tabela de estratégias, buscando os dados via requisição HTTP.
  getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
    this.estrategiaService.getStrategiesPage(queryParams).pipe(
      map(page => {
        console.log(page);
        return mapStrategyPageDtoToStrategyTableRowPage(page);
      })
    )
  );



  onFilterChange(filter: string): void {
    this.activeFilter = this.activeFilter === filter ? '' : filter;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.strategies];

    if (this.activeFilter) {
      filtered = filtered.filter(strategy => {
        const statusMap: { [key: string]: StrategyStatusEnum } = {
          'ativo': StrategyStatusEnum.ACTIVE,
          'inativo': StrategyStatusEnum.INACTIVE
        };

        return strategy.status === statusMap[this.activeFilter.toLowerCase()];
      });
    }

    if (this.searchTerm) {
      filtered = filtered.filter(strategy =>
        strategy.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredStrategies = filtered;
  }

  onStrategyClick(strategyId: number | { id: number }): void {
    let id: number | undefined;
    if (typeof strategyId === 'object' && strategyId !== null && 'id' in strategyId) {
      id = (strategyId as { id: number }).id;
    } else if (typeof strategyId === 'number') {
      id = strategyId;
    }
    if (id) {
      this.router.navigate(['/estrategia', id]);
    } else {
      console.warn('ID da estratégia não encontrado:', strategyId);
    }
  }

  openCreateModal(): void {
    // Reset form values
    this.createStrategyConfig.fields.forEach(field => {
      field.value = '';
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSaveStrategy(fields: FormField[]): void {
    // Process form data
    const strategyData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    // Validar dados antes de enviar
    const validationResult = this.validateStrategyData(strategyData);
    if (!validationResult.isValid) {
      return;
    }

    const newStrategy: Strategy = {
      name: strategyData.name,
      description: strategyData.description,
    };


    this.estrategiaService.createStrategy(newStrategy).subscribe({
      next: (createdStrategy) => {
        this.closeCreateModal();
        if (this.tableComponent) {
          this.tableComponent.refresh();
        }
      },
      error: (err) => {
        console.error('Erro ao criar estratégia:', err);
      }
    });
  }

  private validateStrategyData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar nome
    if (!data.name || data.name.trim() === '') {
      errors.push('Nome é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
  editStrategy() {
    console.log('Editar estratégia');
    // Lógica para edição
  }

  cancelStrategy() {
    console.log('Cancelar estratégia');
    // Lógica para cancelamento
  }

  deleteStrategy() {
    console.log('Excluir estratégia');
    // Lógica para exclusão
    // Pode adicionar um modal de confirmação aqui
  }

  getStatusLabel(status?: StrategyStatusEnum): string {
    if (!status) return 'Desconhecido';

    switch (status) {
      case StrategyStatusEnum.ACTIVE:
        return 'ATIVO';
      case StrategyStatusEnum.INACTIVE:
        return 'INATIVO';
      default:
        return 'Desconhecido';
    }
  }

  getStatusColor(status?: StrategyStatusEnum): string {
    if (!status) return 'gray';

    switch (status) {
      case StrategyStatusEnum.ACTIVE:
        return 'green';
      case StrategyStatusEnum.INACTIVE:
        return 'red';
      default:
        return 'gray';
    }
  }
}
