import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../../../components/table/table-contracts";
import { severityNumberToText } from "../../../mappers/carlos-risks-mappers";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

export const getActionButton = (): ActionButton => {
    return new ActionButton();
}

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = ['ATIVADO'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = ['DESATIVADO'];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Nome do cargo';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Recursos não desativados';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'resourcesCount';
    column.backendAttributeName = 'resourcesCount';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Status';
    column.order = 3;
    column.isSortable = true;
    column.frontendAttributeName = 'status';
    column.backendAttributeName = 'status';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
};

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do cargo';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};
