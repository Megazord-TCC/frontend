import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFilter } from '../table-contracts';
import { PaginationQueryParams } from '../../../models/pagination-models';

@Component({
    selector: 'app-table-filter-buttons',
    imports: [
        SvgIconComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './table-filter-buttons.component.html',
    styleUrl: './table-filter-buttons.component.scss'
})
export class TableFilterButtonsComponent {
    // Parâmetros passados para o service quando for fazer a requisição HTTP GET.
    // Este objeto ***será modificado*** por TablePaginationComponent quando o usuário
    // interagir com os botões de filtro.
    @Input({ required: true }) queryParams!: PaginationQueryParams;

    // Informa quais são os botões de filtro que devem ser exibidos.
    // Este array não é modificado por TablePaginationComponent. Apenas é lido.
    @Input() filterButtons: InputFilter[] = [];

    // Evento emitido quando o usuário interagir com os botões de filtro.
    // O componente pai que usa o TablePaginationComponent deve ouvir este evento
    // e fazer a requisição HTTP para buscar os dados da nova página.
    // O TablePaginationComponent não faz a requisição HTTP por conta própria.
    @Output() filterButtonClick = new EventEmitter<void>();

    // Rótulo do botão de filtro que está ativo (clicado) no momento.
    // Se nenhum botão de filtro estiver ativo, então essa string estará vazia.
    activeFilterButtonLabel = '';

    onFilterButtonClick(filterButton: InputFilter) {
        this.queryParams.page = 0; // Volta para a primeira página quando muda algum filtro.

        // Este filtro estava ativo, e agora deseja desativá-lo.
        if (this.activeFilterButtonLabel == filterButton.label) {
            this.activeFilterButtonLabel = '';
            this.queryParams.filterButtonQueryParam = undefined;
        // Nenhum filtro estava ativo e agora deseja ativar algum.
        // Ou, um filtro estava ativo, e deseja-se ativar outro filtro.
        } else {
            this.activeFilterButtonLabel = filterButton.label;
            this.queryParams.filterButtonQueryParam = filterButton.queryParam;
        }

        this.filterButtonClick.emit();
    }
}
