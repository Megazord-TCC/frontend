import { ActionButton, InputFilter, TableColumn } from "../../../../components/table/table-contracts";

export const getActionButton = (): ActionButton => {
  return new ActionButton();
};

export const getColumns = (): TableColumn[] => {
  let columns: TableColumn[] = [];
  let column: TableColumn;

  column = new TableColumn();
  column.label = 'Projeto';
  column.order = 1;
  column.isSortable = true;
  column.frontendAttributeName = 'projeto';
  column.backendAttributeName = 'resource.project.name';
  column.isClickableMainColumn = true;
  columns.push(column);

  column = new TableColumn();
  column.label = 'Horas/Dia';
  column.order = 2;
  column.isSortable = true;
  column.frontendAttributeName = 'horasDia';
  column.backendAttributeName = 'dailyHours';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Solicitante';
  column.order = 3;
  column.isSortable = true;
  column.frontendAttributeName = 'solicitante';
  column.backendAttributeName = 'createdBy';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Início';
  column.order = 4;
  column.isSortable = true;
  column.frontendAttributeName = 'inicio';
  column.backendAttributeName = 'startDate';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Fim';
  column.order = 5;
  column.isSortable = true;
  column.frontendAttributeName = 'fim';
  column.backendAttributeName = 'endDate';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Prioridade';
  column.order = 6;
  column.isSortable = true;
  column.frontendAttributeName = 'prioridade';
  column.backendAttributeName = 'priority';
  columns.push(column);

  column = new TableColumn();
  column.label = 'Status';
  column.order = 7;
  column.isSortable = true;
  column.frontendAttributeName = 'status';
  column.backendAttributeName = 'status';
  columns.push(column);

  return columns;
};



export const getFilterText = (): InputFilter => {
  let input = new InputFilter();
  input.label = 'Buscar pelo nome do projeto';
  input.queryParam = { name: 'nome', value: '' };
  return input;
};

export const getFilterButtons = (): InputFilter[] => {
  let inputs: InputFilter[] = [];
  let input: InputFilter;

  input = new InputFilter();
  input.label = 'Alocação concluída';
  input.queryParam = { name: 'status', value: "ACTIVE" };
  inputs.push(input);

  input = new InputFilter();
  input.label = 'Alocação cancelada';
  input.queryParam = { name: 'status', value: "INACTIVE" };
  inputs.push(input);

  return inputs;
};
