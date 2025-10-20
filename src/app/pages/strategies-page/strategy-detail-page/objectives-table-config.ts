import { BadgeConfiguration } from '../../../components/table/table-contracts';
import { TableColumn, InputFilter, ActionButton } from '../../../components/table/table-contracts';

// Badge para status dos objetivos estratégicos
export const getBadgeConfigurations = (): BadgeConfiguration[] => {
  let badgeConfigs: BadgeConfiguration[] = [];
  let badgeConfig: BadgeConfiguration;

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'green';
  badgeConfig.triggeringValues = ['ATIVO'];
  badgeConfigs.push(badgeConfig);

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'gray';
  badgeConfig.triggeringValues = ['CANCELADO','PAUSADO'];
  badgeConfigs.push(badgeConfig);

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'red';
  badgeConfig.triggeringValues = ['CANCELADO'];
  badgeConfigs.push(badgeConfig);

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'blue';
  badgeConfig.triggeringValues = ['CONCLUÍDO'];
  badgeConfigs.push(badgeConfig);

  return badgeConfigs;
}

export const getActionButton = (): ActionButton => {
  return new ActionButton();
};

export const getColumns = (): TableColumn[] => {
  let columns: TableColumn[] = [];
  let column: TableColumn;

  column = new TableColumn();
  column.label = 'Nome do objetivo';
  column.order = 1;
  column.isSortable = true;
  column.frontendAttributeName = 'name';
  column.backendAttributeName = 'name';
  column.isClickableMainColumn = true;
  columns.push(column);

  column = new TableColumn();
  column.label = 'Critérios vinculados';
  column.order = 2;
  column.isSortable = true;
  column.frontendAttributeName = 'criteriaCount';
  column.backendAttributeName = 'criteriaCount';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Portfólios ativos vinculados';
  column.order = 3;
  column.isSortable = true;
  column.frontendAttributeName = 'activePortfolioCount';
  column.backendAttributeName = 'activePortfolioCount';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Projetos ativos vinculados';
  column.order = 4;
  column.isSortable = true;
  column.frontendAttributeName = 'activeProjectsCount';
  column.backendAttributeName = 'activeProjectsCount';
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
  input.label = 'Buscar pelo nome do objetivo';
  input.queryParam = { name: 'searchQuery', value: '' };
  return input;
};

export const getFilterButtons = (): InputFilter[] => {
  // Exemplo: filtro por status
  let inputs: InputFilter[] = [];
  let input: InputFilter;

  input = new InputFilter();
  input.label = 'Ativo';
  input.queryParam = { name: 'status', value: 'ACTIVE' };
  inputs.push(input);

  input = new InputFilter();
  input.label = 'Inativo';
  input.queryParam = { name: 'status', value: 'INACTIVE' };
  inputs.push(input);

  return inputs;
};
