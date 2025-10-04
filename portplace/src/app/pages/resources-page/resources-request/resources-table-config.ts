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

const getRiskScaleBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;

    const f = (i: number) => severityNumberToText(i);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = [f(1), f(2)];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = [f(3), f(4)];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'orange';
    badgeConfig.triggeringValues = [f(6), f(8), f(9)];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'red';
    badgeConfig.triggeringValues = [f(12), f(16)];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;

    let numbersOneToTenThousand = [...Array(10000).keys()].map(i => (i + 1).toString());

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = ['0'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'red';
    badgeConfig.triggeringValues = numbersOneToTenThousand;
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
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
    column.label = 'Nome do risco';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Ocorrências não resolvidas';
    column.order = 3;
    // column.isSortable = true;
    column.frontendAttributeName = 'unresolvedOccurrencesCount';
    // column.backendAttributeName = 'occurrences';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    column = new TableColumn();
    column.label = 'Severidade';
    column.order = 4;
    column.isSortable = true;
    column.frontendAttributeName = 'severity';
    column.backendAttributeName = 'severity';
    column.badgeConfiguration = getRiskScaleBadgeConfigurations();
    columns.push(column);

    column = new TableColumn();
    column.label = 'Probabilidade';
    column.order = 5;
    column.isSortable = true;
    column.frontendAttributeName = 'probability';
    column.backendAttributeName = 'probability';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Impacto';
    column.order = 6;
    column.isSortable = true;
    column.frontendAttributeName = 'impact';
    column.backendAttributeName = 'impact';
    columns.push(column);

    return columns;
};

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do risco';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
}; 
