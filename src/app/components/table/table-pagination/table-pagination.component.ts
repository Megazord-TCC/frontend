import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Page, PaginationQueryParams } from '../../../models/pagination-models';

@Component({
    selector: 'app-table-pagination',
    imports: [
        FormsModule,
        CommonModule
    ],
    templateUrl: './table-pagination.component.html',
    styleUrl: './table-pagination.component.scss'
})
export class TablePaginationComponent {
    // Dados da página atual. 
    // Este objeto ***não será modificado*** por TablePaginationComponent. Apenas será lido.
    @Input() page?: Page<any>;

    // Parâmetros passados para o service quando for fazer a requisição HTTP GET.
    // Este objeto ***será modificado*** por TablePaginationComponent quando o usuário
    // interagir com os controles de paginação (mudar tamanho da página, ir para a próxima página, etc).
    @Input({ required: true }) queryParams!: PaginationQueryParams;

    // Evento emitido quando o usuário interagir com os controles de paginação
    // (mudar tamanho da página, ir para a próxima página, etc).
    // O componente pai que usa o TablePaginationComponent deve ouvir este evento
    // e fazer a requisição HTTP para buscar os dados da nova página.
    // O TablePaginationComponent não faz a requisição HTTP por conta própria.
    @Output() paginationChange = new EventEmitter<void>();

    // Valores possíveis para o select de tamanho da página.
    // O valor padrão selecionado é 10.
    pageSizeOptions = ['5', '10', '20', '50', '100'];
    pageSizeSelected = '10';

    getCurrentPageElementsCounterText(): string {
        if (!this.page)
            return 'Contador de elementos indisponível';

        let offset = this.page.pageable.offset;
        let firstElementNumber = 0;

        if (!this.page.empty)
            firstElementNumber = offset + 1;
        
        let lastElementNumber = offset + this.page.numberOfElements;
        let totalElements = this.page.totalElements;

        return `Mostrando ${firstElementNumber} a ${lastElementNumber} de ${totalElements} registros`;
    }

    getCurrentPageNumber(): string {
        if (!this.page)
            return '-';

        return `${this.page.pageable.pageNumber + 1}`; // +1 porque o backend começa a contar da página 0.
    }

    onPageSizeChange(): void {
        this.queryParams.size = Number(this.pageSizeSelected);
        this.queryParams.page = 0;
        this.paginationChange.emit();
    }

    goToFirstPage(): void {
        this.queryParams.page = 0;
        this.paginationChange.emit();
    }

    goToPreviousPage(): void {
        if (!this.page || this.page.first)
            return;

        this.queryParams.page = this.page.pageable.pageNumber - 1;
        this.paginationChange.emit();
    }

    goToNextPage(): void {
        if (!this.page || this.page.last)
            return;

        this.queryParams.page = this.page.pageable.pageNumber + 1;
        this.paginationChange.emit();
    }

    goToLastPage(): void {
        if (!this.page)
            return;

        this.queryParams.page = this.page.totalPages - 1;
        this.paginationChange.emit();
    }
}
