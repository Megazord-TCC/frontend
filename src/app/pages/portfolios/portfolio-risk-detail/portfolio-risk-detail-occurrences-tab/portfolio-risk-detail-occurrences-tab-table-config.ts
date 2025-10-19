import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../../../../components/table/table-contracts";
import { RiskOccurrenceStatus } from "../../../../interface/carlos-risk-occurrence-interfaces";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = [RiskOccurrenceStatus.SOLVED];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'red';
    badgeConfig.triggeringValues = [RiskOccurrenceStatus.NOT_SOLVED];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export const getActionButton = (): ActionButton => {
    return new ActionButton();
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Código';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'id';
    column.backendAttributeName = 'id';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Data da ocorrência';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'dateOfOccurrence';
    column.backendAttributeName = 'dateOfOccurrence';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Descrição';
    column.order = 3;
    column.isSortable = true;
    column.frontendAttributeName = 'description';
    column.backendAttributeName = 'description';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Tempo até hoje ou resolução (dias)';
    column.order = 4;
    column.isSortable = true;
    column.frontendAttributeName = 'daysToSolve';
    column.backendAttributeName = 'daysToSolve';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Status';
    column.order = 5;
    column.isSortable = true;
    column.frontendAttributeName = 'status';
    column.backendAttributeName = 'status';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pela descrição';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};