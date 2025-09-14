import { BadgeConfiguration, InputFilter, TableColumn } from "../../../components/table/table-contracts";
import { PortfolioProjectTableRowProjectStatus, ProjectStatusEnumDTO2 } from "../../../interface/carlos-project-dtos";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.


// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;
    
    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'blue';
    badgeConfig.triggeringValues = [PortfolioProjectTableRowProjectStatus.COMPLETED];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = [PortfolioProjectTableRowProjectStatus.CANCELLED];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = [PortfolioProjectTableRowProjectStatus.IN_ANALYSIS];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = [PortfolioProjectTableRowProjectStatus.IN_PROGRESS];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Nome';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Orçamento (R$)';
    column.order = 2;
    // column.isSortable = true; // Comentado pois backend não permite ordenação
    column.frontendAttributeName = 'budget';
    // column.backendAttributeName = 'estimateAtCompletion';
    columns.push(column);

    column = new TableColumn();
    column.label = 'EV (R$)';
    column.order = 3;
    column.isSortable = true;
    column.frontendAttributeName = 'earnedValue';
    column.backendAttributeName = 'earnedValue';
    columns.push(column);

    column = new TableColumn();
    column.label = 'PV (R$)';
    column.order = 4;
    column.isSortable = true;
    column.frontendAttributeName = 'plannedValue';
    column.backendAttributeName = 'plannedValue';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Início planejado';
    column.order = 5;
    column.isSortable = true;
    column.frontendAttributeName = 'startDate';
    column.backendAttributeName = 'startDate';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Fim planejado';
    column.order = 6;
    column.isSortable = true;
    column.frontendAttributeName = 'endDate';
    column.backendAttributeName = 'endDate';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Status';
    column.order = 7;
    column.isSortable = true;
    column.frontendAttributeName = 'status';
    column.backendAttributeName = 'status';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do projeto';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
}; 

export const getFilterButtons = (): InputFilter[] => {
    let inputs: InputFilter[] = [];
    let input: InputFilter;

    input = new InputFilter();
    input.label = 'Cancelado';
    input.queryParam = { name: 'status', value: ProjectStatusEnumDTO2.CANCELLED };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Finalizado';
    input.queryParam = { name: 'status', value: ProjectStatusEnumDTO2.COMPLETED };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Em análise';
    input.queryParam = { name: 'status', value: ProjectStatusEnumDTO2.IN_ANALYSIS };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Em andamento';
    input.queryParam = { name: 'status', value: ProjectStatusEnumDTO2.IN_PROGRESS };
    inputs.push(input);

    return inputs;
}; 