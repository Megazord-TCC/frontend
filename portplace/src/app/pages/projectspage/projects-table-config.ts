import { ScenarioStatusEnum } from "../../interface/carlos-scenario-dtos";
import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../../components/table/table-contracts";

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
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = ['AUTORIZADO'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = ['CANCELADO'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = ['AGUARDANDO AUTORIZAÇÃO'];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    // Nome do projeto
    column = new TableColumn();
    column.label = 'Nome do projeto';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    // Portfólio
    column = new TableColumn();
    column.label = 'Portfólio';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'portfolio';
    column.backendAttributeName = 'portfolio';
    columns.push(column);

    // Orçamento
    column = new TableColumn();
    column.label = 'Orçamento';
    column.order = 3;
    column.isSortable = true;
    column.frontendAttributeName = 'budget';
    column.backendAttributeName = 'budget';
    columns.push(column);

    // EV
    column = new TableColumn();
    column.label = 'EV';
    column.order = 4;
    column.isSortable = true;
    column.frontendAttributeName = 'earnedValue';
    column.backendAttributeName = 'earnedValue';
    columns.push(column);

    // PV
    column = new TableColumn();
    column.label = 'PV';
    column.order = 5;
    column.isSortable = true;
    column.frontendAttributeName = 'plannedValue';
    column.backendAttributeName = 'plannedValue';
    columns.push(column);

    // Início planejado
    column = new TableColumn();
    column.label = 'Início planejado';
    column.order = 6;
    column.isSortable = true;
    column.frontendAttributeName = 'startDate';
    column.backendAttributeName = 'startDate';
    columns.push(column);

    // Fim planejado
    column = new TableColumn();
    column.label = 'Fim planejado';
    column.order = 7;
    column.isSortable = true;
    column.frontendAttributeName = 'endDate';
    column.backendAttributeName = 'endDate';
    columns.push(column);

    // Status
    column = new TableColumn();
    column.label = 'Status';
    column.order = 8;
    column.isSortable = true;
    column.frontendAttributeName = 'status';
    column.backendAttributeName = 'status';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
};

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do cenário';
    input.queryParam = { name: 'name', value: '' };
    return input;
};

export const getFilterButtons = (): InputFilter[] => {
    let inputs: InputFilter[] = [];
    let input: InputFilter;

    input = new InputFilter();
    input.label = 'Aguardando autorização';
    input.queryParam = { name: 'status', value: "WAITING_AUTHORIZATION" };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Autorizado';
    input.queryParam = { name: 'status', value: "AUTHORIZED" };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Cancelado';
    input.queryParam = { name: 'status', value: "CANCELLED" };
    inputs.push(input);

    return inputs;
};
