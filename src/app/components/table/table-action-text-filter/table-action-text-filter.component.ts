import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../../svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActionButton, InputFilter } from '../table-contracts';
import { PaginationQueryParams, QueryParam } from '../../../models/pagination-models';

@Component({
    selector: 'app-table-action-text-filter',
    imports: [
        SvgIconComponent,
        FormsModule,
        CommonModule,
    ],
    templateUrl: './table-action-text-filter.component.html',
    styleUrl: './table-action-text-filter.component.scss'
})
export class TableActionTextFilterComponent {
    // Parâmetros passados para o service quando for fazer a requisição HTTP GET.
    // Este objeto ***será modificado*** por TablePaginationComponent quando o usuário
    // interagir com o filtro de texto.
    @Input({ required: true }) queryParams!: PaginationQueryParams;

    // Informa qual é o campo de filtro de texto que deve ser exibido.
    @Input() filterText?: InputFilter;

    // Informa qual botão de ação deve ser exibido.
    @Input() actionButton?: ActionButton;

    // Evento emitido quando o usuário interagir com os controles de paginação
    // (mudar tamanho da página, ir para a próxima página, etc).
    // O componente pai que usa o TablePaginationComponent deve ouvir este evento
    // e fazer a requisição HTTP para buscar os dados da nova página.
    // O TablePaginationComponent não faz a requisição HTTP por conta própria.
    @Output() filterTextInput = new EventEmitter<void>();

    // Evento emitido quando o usuário clicar no botão de ação.
    @Output() actionButtonClick = new EventEmitter<void>();

    // Valor preenchido pelo usuário no campo de busca de texto.
    filterTextCurrentValue = '';

    onFilterTextInput() {
        this.queryParams.page = 0; // Volta para a primeira página quando muda algum filtro.
        
        // Há texto no input de filtro de texto
        if (this.filterTextCurrentValue && this.filterText) {
            let queryParam: QueryParam = { ...this.filterText?.queryParam };
            queryParam.value = this.filterTextCurrentValue;
            this.queryParams.filterTextQueryParam = queryParam;
        // Não há texto no input de filtro de texto
        } else {
            this.queryParams.filterTextQueryParam = undefined;
        }

        this.filterTextInput.emit();
    }
}
