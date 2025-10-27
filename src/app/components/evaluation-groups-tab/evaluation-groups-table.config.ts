import { TableColumn, BadgeConfiguration, InputFilter, ActionButton } from '../../components/table/table-contracts';

export const getActionButton = (): ActionButton => {
  return new ActionButton();
}



export const getEvaluationColumns = (): TableColumn[] => {
  let columns: TableColumn[] = [];
  let column: TableColumn;

  // Nome da avaliação
  column = new TableColumn();
  column.label = 'Nome da avaliação';
  column.order = 1;
  column.isSortable = true;
  column.frontendAttributeName = 'name';
  column.backendAttributeName = 'name';
  column.isClickableMainColumn = true;
  columns.push(column);

  // Grupo de critérios
  column = new TableColumn();
  column.label = 'Grupo de critérios';
  column.order = 2;
  column.isSortable = true;
  column.frontendAttributeName = 'criteriaGroup';
  column.backendAttributeName = 'criteriaGroup';
  columns.push(column);

  return columns;
};

export const getEvaluationFilterText = (): InputFilter => {
  let input = new InputFilter();
  input.label = 'Buscar pelo nome da avaliação';
  input.queryParam = { name: 'searchQuery', value: '' };
  return input;
};

export const getEvaluationFilterButtons = (): InputFilter[] => {
  let inputs: InputFilter[] = [];
  let input: InputFilter;

  input = new InputFilter();
  input.label = 'Ativo';
  input.queryParam = { name: 'disabled', value: 'ACTIVE' };
  inputs.push(input);

  input = new InputFilter();
  input.label = 'Desativado';
  input.queryParam = { name: 'disabled', value: 'INACTIVE' };
  inputs.push(input);

  return inputs;
};
