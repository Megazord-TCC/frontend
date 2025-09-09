import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from '../../components/table/table-contracts';

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

  // Probabilidade (peso)
  column = new TableColumn();
  column.label = 'Probabilidade';
  column.order = 2;
  column.isSortable = true;
  column.frontendAttributeName = 'weight';
  column.backendAttributeName = 'weight';
  // Formatter para exibir como porcentagem
  column.formatter = (value: number) => {
    if (value == null || isNaN(value)) return '0%';
    const percentage = Math.round(value * 100);
    const clamped = Math.max(0, Math.min(100, percentage));
    return clamped + '%';
  };
  columns.push(column);

  // Objetivos vinculados
  column = new TableColumn();
  column.label = 'Objetivos vinculados';
  column.order = 3;
  column.isSortable = false;
  column.frontendAttributeName = 'relatedObjectivesCount';
  column.backendAttributeName = 'relatedObjectivesCount';
  columns.push(column);

  return columns;
};

export const getFilterText = (): InputFilter => {
  let input = new InputFilter();
  input.label = 'Buscar pelo nome do critério';
  input.queryParam = { name: 'name', value: '' };
  return input;
};

export const getFilterButtons = (): InputFilter[] => {
  // Nenhum filtro de botão necessário para critérios
  return [];
};
