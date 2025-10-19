import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from "../../../../components/table/table-contracts";
import { PortfolioLevelScale } from "../../../../interface/carlos-portfolio-stakeholders-interfaces";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;
    
    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'red';
    badgeConfig.triggeringValues = [PortfolioLevelScale.HIGH];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = [PortfolioLevelScale.LOW];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = [PortfolioLevelScale.MEDIUM];
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
    column.label = 'Nome da parte interessada';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'name';
    column.backendAttributeName = 'name';
    column.isClickableMainColumn = true;
    columns.push(column);

    column = new TableColumn();
    column.label = 'Nível de poder';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'powerLevel';
    column.backendAttributeName = 'powerLevel';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    column = new TableColumn();
    column.label = 'Nível de interesse';
    column.order = 3;
    column.isSortable = true;
    column.frontendAttributeName = 'interestLevel';
    column.backendAttributeName = 'interestLevel';
    column.badgeConfiguration = getBadgeConfigurations();
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do interessado';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
};