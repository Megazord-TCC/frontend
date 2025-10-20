import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../../../components/table/table-contracts";
import { PortfolioDTOStatus, PortfolioTableRowStatus } from "../../../interface/carlos-portfolio-interfaces";

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
    badgeConfig.triggeringValues = [PortfolioTableRowStatus.FINALIZADO];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = [PortfolioTableRowStatus.CANCELADO];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = [PortfolioTableRowStatus.EM_ANDAMENTO];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'blue';
    badgeConfig.triggeringValues = [PortfolioTableRowStatus.VAZIO];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Nome do portfólio';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Status';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'status';
    column.backendAttributeName = 'status';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
};

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};

export const getFilterButtons = (): InputFilter[] => {
    let inputs: InputFilter[] = [];
    let input: InputFilter;

    input = new InputFilter();
    input.label = 'Vazio';
    input.queryParam = { name: 'status', value: PortfolioDTOStatus.VAZIO };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Em andamento';
    input.queryParam = { name: 'status', value: PortfolioDTOStatus.EM_ANDAMENTO };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Finalizado';
    input.queryParam = { name: 'status', value: PortfolioDTOStatus.FINALIZADO };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Cancelado';
    input.queryParam = { name: 'status', value: PortfolioDTOStatus.CANCELADO };
    inputs.push(input);

    return inputs;
};
