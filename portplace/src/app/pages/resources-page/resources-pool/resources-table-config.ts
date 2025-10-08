
import { ActionButton, InputFilter, TableColumn } from '../../../components/table/table-contracts';
import { ResourcesPositionTableRow } from '../../../mappers/resources-mappers';

export const getActionButton = (): ActionButton => {
	return new ActionButton();
};

export const getColumns = (): TableColumn[] => {
	let columns: TableColumn[] = [];
	let column: TableColumn;

	column = new TableColumn();
	column.label = 'Nome';
	column.order = 1;
	column.isSortable = true;
	column.frontendAttributeName = 'nome';
	column.backendAttributeName = 'name';
	column.isClickableMainColumn = true;
	columns.push(column);

	column = new TableColumn();
	column.label = 'Cargo';
	column.order = 2;
	column.isSortable = false;
	column.frontendAttributeName = 'cargo';
	column.backendAttributeName = 'position.name';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Horas/dia contrato';
	column.order = 3;
	column.isSortable = true;
	column.frontendAttributeName = 'horasDiaContrato';
	column.backendAttributeName = 'dailyHours';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Projetos vinculados';
	column.order = 4;
	column.isSortable = true;
	column.frontendAttributeName = 'projetosVinculados';
	column.backendAttributeName = 'relatedProjectsCount';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Horas ociosas';
	column.order = 5;
	column.isSortable = true;
	column.frontendAttributeName = 'horasOciosas';
	column.backendAttributeName = 'availableHours';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Status';
	column.order = 6;
	column.isSortable = true;
	column.frontendAttributeName = 'status';
	column.backendAttributeName = 'status';
	columns.push(column);

	return columns;
};

export const getFilterText = (): InputFilter => {
	let input = new InputFilter();
	input.label = 'Buscar pelo nome do recurso';
	input.queryParam = { name: 'nome', value: '' };
	return input;
};

export const getFilterButtons = (): InputFilter[] => {
	let inputs: InputFilter[] = [];
	let input: InputFilter;

	input = new InputFilter();
	input.label = 'Ativado';
	input.queryParam = { name: 'status', value: "ACTIVE" };
	inputs.push(input);

	input = new InputFilter();
	input.label = 'Desativado';
	input.queryParam = { name: 'status', value: "INACTIVE" };
	inputs.push(input);

	return inputs;
};

export type ResourceTableRow = ResourcesPositionTableRow;
