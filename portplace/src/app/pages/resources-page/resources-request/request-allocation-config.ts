import { ActionButton, InputFilter, TableColumn } from '../../../components/table/table-contracts';
// Importe o tipo correto do row se existir
// import { AllocationRequestTableRow } from '../../../mappers/allocation-mappers';

export const getActionButton = (): ActionButton => {
	return new ActionButton();
};

export const getColumns = (): TableColumn[] => {
	let columns: TableColumn[] = [];
	let column: TableColumn;

	column = new TableColumn();
	column.label = 'Cargo desejado';
	column.order = 1;
	column.isSortable = true;
	column.frontendAttributeName = 'cargoDesejado';
	column.backendAttributeName = 'desiredPosition.name';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Horas/Dia';
	column.order = 2;
	column.isSortable = true;
	column.frontendAttributeName = 'horasDia';
	column.backendAttributeName = 'dailyHours';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Projeto';
	column.order = 3;
	column.isSortable = true;
	column.frontendAttributeName = 'projeto';
	column.backendAttributeName = 'project.name';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Solicitante';
	column.order = 4;
	column.isSortable = true;
	column.frontendAttributeName = 'solicitante';
	column.backendAttributeName = 'requester.name';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Início';
	column.order = 5;
	column.isSortable = true;
	column.frontendAttributeName = 'inicio';
	column.backendAttributeName = 'startDate';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Fim';
	column.order = 6;
	column.isSortable = true;
	column.frontendAttributeName = 'fim';
	column.backendAttributeName = 'endDate';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Prioridade';
	column.order = 7;
	column.isSortable = true;
	column.frontendAttributeName = 'prioridade';
	column.backendAttributeName = 'priority';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Status';
	column.order = 8;
	column.isSortable = true;
	column.frontendAttributeName = 'status';
	column.backendAttributeName = 'status';
	columns.push(column);

	return columns;
};

export const getFilterText = (): InputFilter => {
	let input = new InputFilter();
	input.label = 'Buscar por projeto ou solicitante';
	input.queryParam = { name: 'search', value: '' };
	return input;
};

export const getFilterButtons = (): InputFilter[] => {
	let inputs: InputFilter[] = [];
	let input: InputFilter;

	input = new InputFilter();
	input.label = 'Alocado';
	input.queryParam = { name: 'status', value: 'ALLOCATED' };
	inputs.push(input);

	input = new InputFilter();
	input.label = 'Em análise';
	input.queryParam = { name: 'status', value: 'IN_ANALYSIS' };
	inputs.push(input);

	input = new InputFilter();
	input.label = 'Rejeitado';
	input.queryParam = { name: 'status', value: 'REJECTED' };
	inputs.push(input);

	input = new InputFilter();
	input.label = 'Cancelado';
	input.queryParam = { name: 'status', value: 'CANCELLED' };
	inputs.push(input);

	return inputs;
};

// export type AllocationRequestTableRow = ...
