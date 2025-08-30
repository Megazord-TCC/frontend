import { ScenarioStatusEnum } from "../../interface/carlos-scenario-dtos";
import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../table/table-contracts";

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

    column = new TableColumn();
    column.label = 'Nome do cenário';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Orçamento';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'budget';
    column.backendAttributeName = 'budget';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Grupo de avaliação';
    column.order = 3;
    column.frontendAttributeName = 'evaluationGroupName';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Projetos incluídos';
    column.order = 4;
    column.frontendAttributeName = 'includedProjectsQuantity';
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
    input.label = 'Buscar pelo nome do cenário';
    input.queryParam = { name: 'name', value: '' };
    return input;
}; 

export const getFilterButtons = (): InputFilter[] => {
    let inputs: InputFilter[] = [];
    let input: InputFilter;

    input = new InputFilter();
    input.label = 'Aguardando autorização';
    input.queryParam = { name: 'status', value: ScenarioStatusEnum.WAITING_AUTHORIZATION.valueOf().toString() };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Autorizado';
    input.queryParam = { name: 'status', value: ScenarioStatusEnum.AUTHORIZED.valueOf().toString() };
    inputs.push(input);

    input = new InputFilter();
    input.label = 'Cancelado';
    input.queryParam = { name: 'status', value: ScenarioStatusEnum.CANCELLED.valueOf().toString() };
    inputs.push(input);

    return inputs;
}; 