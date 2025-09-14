import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from '../../../components/table/table-contracts';

export const getActionButton = (): ActionButton => {
  return new ActionButton();
}

const getBadgeConfigurations = (): BadgeConfiguration[] => {
  let badgeConfigs: BadgeConfiguration[] = [];
  let badgeConfig: BadgeConfiguration;

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'green';
  badgeConfig.triggeringValues = ['ATIVO'];
  badgeConfigs.push(badgeConfig);

  badgeConfig = new BadgeConfiguration();
  badgeConfig.color = 'red';
  badgeConfig.triggeringValues = ['INATIVO'];
  badgeConfigs.push(badgeConfig);

  return badgeConfigs;
}

export const getColumns = (): TableColumn[] => {
  let columns: TableColumn[] = [];
  let column: TableColumn;

  // Nome do critério
  column = new TableColumn();
  column.label = 'Nome do critério';
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
  input.label = 'Buscar pelo nome da estratégia';
  input.queryParam = { name: 'name', value: '' };
  return input;
};

export const getFilterButtons = (): InputFilter[] => {
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
function formatWeightAsPercentage(weight: number | null | undefined): string {
  if (weight == null || isNaN(weight)) {
    return '0%';
  }
  const percentage = Math.round(weight * 100);
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  return clampedPercentage + '%';
}

