import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActionButton, CurrentlySortedColumn, InputFilter, SelectButtonOptionSelected, TableColumn } from './table-contracts';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TableFilterButtonsComponent } from './table-filter-buttons/table-filter-buttons.component';
import { TableActionTextFilterComponent } from './table-action-text-filter/table-action-text-filter.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../models/pagination-models';

@Component({
    selector: 'app-table',
    imports: [
        SvgIconComponent,
        CardComponent,
        BadgeComponent,
        FormsModule,
        CommonModule,
        TablePaginationComponent,
        TableFilterButtonsComponent,
        TableActionTextFilterComponent
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss'
})
export class TableComponent {
    // Método que o TableComponent usará para buscar os dados via requisição HTTP.
    @Input({ required: true }) dataRetrievalMethodRef!: DataRetrievalMethodForTableComponent;

    // Informa qual é o campo de filtro de texto que deve ser exibido.
    @Input({ required: true }) filterText!: InputFilter;

    // Informa quais são as colunas que devem ser exibidas na tabela.
    @Input({ required: true }) columns: TableColumn[] = [];

    // Informa quais são os botões de filtro que devem ser exibidos.
    // Se for array vazio, então nenhum botão de filtro será exibido.
    @Input() filterButtons: InputFilter[] = [];

    // Informa qual botão de ação deve ser exibido.
    // Esse botão de ação emitirá evento `actionButtonClick` quando for clicado.
    // Esse botão pode ser usado para o componente pai abrir uma modal, por exemplo.
    // Se for undefined, então nenhum botão de ação será exibido.
    @Input() actionButton?: ActionButton;

    // Evento emitido quando o usuário clicar em uma célula da coluna principal (aquela que tem isClickableMainColumn = true).
    // O componente pai que usa o TableComponent deve ouvir este evento e tomar a ação apropriada (ex: navegar para outra página
    // ou abrir uma modal).
    @Output() mainColumnRowClick = new EventEmitter<any>();

    // Evento emitido quando o botão de ação é clicado.
    // O componente pai que usa o TableComponent deve ouvir este evento e tomar a ação apropriada (ex: abrir uma modal).
    // Esse evento só é emitido se o `Input() actionButton` for definido.
    @Output() actionButtonClick = new EventEmitter<void>();

    // Evento emitido quando um valor dum <select> é selecionado dentro duma linha da tabela.
    // Só é exibido o <select> quando o TableColumn foi configurado com o atributo SelectButton.
    @Output() selectChange = new EventEmitter<SelectButtonOptionSelected>();

    // Contém dados de paginação retornados pelo service.
    // Para acessar a lista de objetos, usar 'page.content'.
    // Essa lista será por exemplo `User[]`, se o service retornar uma lista de usuários.
    page?: Page<any>;

    // Esses parâmetros serão passados para o service quando for fazer a requisição HTTP GET.
    // O componente que usa este TableComponent pode alterar esses parâmetros para filtrar, ordenar, mudar página, etc.
    queryParams = new PaginationQueryParams();

    // Coluna que está atualmente sendo utilizada para ordenar a tabela.
    // Se nenhuma coluna estiver sendo utilizada para ordenar, então esse atributo será undefined.
    activeSortedColumn?: CurrentlySortedColumn;

    // Contém os valores atuais de todos selects da tabela.
    // É necessário isso aqui pra conseguir definir os valores iniciais de cada select.
    selectButtonOptionsSelected: SelectButtonOptionSelected[] = [];

    changeDetectorRef = inject(ChangeDetectorRef);

    ngOnInit() {
        this.columns.sort((a, b) => a.order - b.order);
        this.sendHttpGetRequestAndPopulateTable();
    }

    disableAllTableSelectButtons() {
        this.columns.forEach(column => {
            if (column.selectButtonConfiguration) {
                column.selectButtonConfiguration.disabled = true;
            }
        });
    }

    enableAllTableSelectButtons() {
        this.columns.forEach(column => {
            if (column.selectButtonConfiguration) {
                column.selectButtonConfiguration.disabled = false;
            }
        });
    }

    setSelectButtonValues() {
        let options: SelectButtonOptionSelected[] = [];
        let rows = this.page?.content ?? [];
        let columnsWithSelectButton = this.columns.filter(column => !!column.selectButtonConfiguration);

        rows.forEach(row => {
            columnsWithSelectButton.forEach(column => {
                let option = new SelectButtonOptionSelected();
                option.column = column;
                option.row = row;
                option.value = row[column.frontendAttributeName];
                options.push(option);
            });
        });

        this.selectButtonOptionsSelected = options;
    }

    isSelectButton(frontendAttributeName: string): boolean {
        return this.columns.some(column =>
            (column.frontendAttributeName == frontendAttributeName)
            && (column.selectButtonConfiguration)
        );
    }

    getSelectButtonValue(row: any, frontendAttributeName: string): string {
        return this.getSelectButton(row, frontendAttributeName)?.value ?? '';
    }

    getSelectButtonDisabled(row: any, frontendAttributeName: string): boolean {
        return this.getSelectButton(row, frontendAttributeName)?.column.selectButtonConfiguration?.disabled ?? false;
    }

    getSelectButtonOptions(row: any, frontendAttributeName: string): { label: string, value: string, hidden: boolean }[] {
        return this.getSelectButton(row, frontendAttributeName)?.column.selectButtonConfiguration?.options ?? [];
    }

    getSelectButton(row: any, frontendAttributeName: string): SelectButtonOptionSelected | undefined {
        return this.selectButtonOptionsSelected.find(option =>
            (option.row == row) && (option.column.frontendAttributeName == frontendAttributeName)
        );
    }

    onChangeSelectedValue(event: any, row: any, attributeName: string) {
        let column = this.columns.find(column => column.frontendAttributeName === attributeName);

        if (column)
            this.selectChange.emit({ value: event?.target?.value, row, column });
    }

    getCellValue(row: any, column: TableColumn): string {
        const value = row[column.frontendAttributeName];
        if (column.formatter) {
            return column.formatter(value, row);
        }
        return value != null ? value.toString() : '';
    }

    sendHttpGetRequestAndPopulateTable() {
        this.dataRetrievalMethodRef(this.queryParams).subscribe(page => {
            this.page = page;
            this.setSelectButtonValues();
        });
    }

    getDesiredAndExistingColumnsToPrint(): TableColumn[] {
        // TODO: Futuramente adicionar lógica que confere se as colunas pedem atributos
        // que realmente existem no retorno do service, pra não acabar imprimindo colunas a mais
        // (isso é possível se o programador usar este componente da maneira errada).
        // Fazer algo similar ao feito em getDesiredAndExistingAttributeNamesToPrint().
        // Precisa ordenar segundo o atributo 'ordem' também.
        return this.columns;
    }

    /**
     * Retorna os atributos que desejamos imprimir que realmente existem no objeto retornado pelo service.
     * Isso evita imprimir colunas sem nada.
     *
     * Por exemplo, imagine que o service retorna um objeto `page.content` do tipo `Usuario` com os atributos `id`, e `nome`,
     * sendo que queremos imprimir os atributos `name` e `description`. No caso, `description` não existe no `page.content`,
     * sendo assim esse método só retorna o nome do atributo `name`.
     *
     * É importante que os atributos estejam ordenados, por isso esse método também aplica ordenação conforme definido em
     * `TableColumn.order`.
     */
    getDesiredAndExistingAttributeNamesToPrint(): string[] {
        if (!this.page?.content.length)
            return [];

        let desiredAttributes = this.getDesiredAttributes();
        let existingAttributes = this.getExistingAttributes();

        let desiredAndExistingAttributes = desiredAttributes.filter(
            desiredAttribute => existingAttributes.some(existingAttribute => existingAttribute == desiredAttribute.attributeName)
        );

        return desiredAndExistingAttributes.map(attribute => attribute.attributeName);
    }

    /**
     * Retorna os atributos que nós queremos imprimir.
     * Ex: queremos imprimir na tabela os atributos `id` e `name` do objeto `Usuario`.
     * > Obs: este método não se importa se esses atributos realmente existem em `Usuario`, apenas indica que queremos imprimí-los.
     */
    getDesiredAttributes(): { attributeName: string, attributeOrder: number }[] {
        return this.columns.map(column => ({
            attributeName: column.frontendAttributeName,
            attributeOrder: column.order
        }));
    }

    /**
     * O service retorna uma lista de objetos paginada. Esses objetos tem um tipo definido (ex: `Usuario`).
     * Este método retorna os atributos desse tipo (ex: `['id', 'name', 'description'...]`).
     */
    getExistingAttributes(): string[] {
        if (!this.page?.content.length)
            return [];

        // Qualquer objeto, pois só preciso de um pra ver quais atributos existem dentro dele.
        let objetoQualquer = this.page.content[0];

        return Object.keys(objetoQualquer);
    }

    isClickableMainColumn(frontendAttributeName: string): boolean {
        return this.columns.some(column =>
            column.frontendAttributeName == frontendAttributeName
            && column.isClickableMainColumn
        );
    }

    hasBadgeStyle(frontendAttributeName: string): boolean {
        return this.columns.some(column =>
            column.frontendAttributeName == frontendAttributeName
            && column.badgeConfiguration.length
        );
    }

    getBadgeColor(row: any, frontendAttributeName: string): string {
        let defaultColor = 'blue';
        let column = this.columns.find(column => column.frontendAttributeName == frontendAttributeName);

        if (!column)
            return defaultColor;

        let matchingBadgeConfig = column.badgeConfiguration.find(badgeConfig =>
            badgeConfig.triggeringValues.some(value => value == row[frontendAttributeName])
        );

        if (matchingBadgeConfig)
            return matchingBadgeConfig.color;

        return defaultColor;
    }

    onColumnHeaderClick(column: TableColumn): void {
        if (!column.isSortable)
            return;

        // Clicou na coluna que já estava ativa, então inverte a ordenação.
        if (this.activeSortedColumn && this.activeSortedColumn.frontendAttributeName == column.frontendAttributeName) {
            this.activeSortedColumn.sortDir = this.activeSortedColumn.sortDir == 'asc' ? 'desc' : 'asc';
        // Clicou em uma coluna diferente da que estava ativa, então ativa a nova coluna com ordenação ascendente.
        } else {
            this.activeSortedColumn = {
                frontendAttributeName: column.frontendAttributeName,
                sortDir: 'asc'
            };
        }
        this.queryParams.sortBy = column.backendAttributeName;
        this.queryParams.sortDir = this.activeSortedColumn.sortDir;
        this.queryParams.page = 0; // Volta pra primeira página quando muda a ordenação.
        this.sendHttpGetRequestAndPopulateTable();
    }

    getSortIconPath(column: TableColumn): string {
        if (!this.activeSortedColumn || this.activeSortedColumn.frontendAttributeName != column.frontendAttributeName)
            return 'assets/icon/sort-alt.svg';
        if (this.activeSortedColumn.sortDir == 'asc')
            return 'assets/icon/arrow_up_vector.svg';
        return 'assets/icon/arrow_down_vector.svg';
    }

    isColumnCurrentlySorted(column: TableColumn): boolean {
        return this.activeSortedColumn?.frontendAttributeName == column.frontendAttributeName;
    }

    refresh() {
        this.sendHttpGetRequestAndPopulateTable();
    }
}
