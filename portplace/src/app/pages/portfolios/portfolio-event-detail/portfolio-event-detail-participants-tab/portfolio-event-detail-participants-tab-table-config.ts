import { ActionButton, InputFilter, TableColumn } from "../../../../components/table/table-contracts";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

export const getActionButton = (): ActionButton => {
    return new ActionButton();
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Nome do participante';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'participantName';
    column.backendAttributeName = 'stakeholder.name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Responsável pelo evento';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'isResponsible';
    column.backendAttributeName = 'responsible';
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do participante';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};