import { InputFilter, TableColumn } from "../../../../components/table/table-contracts";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Nome do evento';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'eventName';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do evento';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};