import { ActionButton, BadgeConfiguration, InputFilter, TableColumn } from '../../../components/table/table-contracts';
import { AllocationRequestStatusEnum } from '../../../interface/allocation-request-interfaces';
// Importe o tipo correto do row se existir
// import { AllocationRequestTableRow } from '../../../mappers/allocation-mappers';

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = ['ALOCADO'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'gray';
    badgeConfig.triggeringValues = ['CANCELADO'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'yellow';
    badgeConfig.triggeringValues = ['EM ANÁLISE'];
    badgeConfigs.push(badgeConfig);

    // badgeConfig = new BadgeConfiguration();
    // badgeConfig.color = 'red';
    // badgeConfig.triggeringValues = ['REJEITADO'];
    // badgeConfigs.push(badgeConfig);


    return badgeConfigs;
}
export const getActionButton = (): ActionButton => {
	return new ActionButton();
};

export const getColumns = (isPMO: boolean = false): TableColumn[] => {
	let columns: TableColumn[] = [];
	let column: TableColumn;

	column = new TableColumn();
	column.label = 'Cargo';
	column.order = 1;
	column.isSortable = true;
	column.frontendAttributeName = 'cargoDesejado';
	column.backendAttributeName = 'position.name';
  column.isClickableMainColumn = isPMO;
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
	column.backendAttributeName = 'project';
	columns.push(column);

	column = new TableColumn();
	column.label = 'Solicitante';
	column.order = 4;
	column.isSortable = true;
	column.frontendAttributeName = 'solicitante';
	column.backendAttributeName = 'createdBy';
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
  column.badgeConfiguration = getBadgeConfigurations();
	columns.push(column);

	return columns;
};

export const getFilterText = (): InputFilter => {
	let input = new InputFilter();
	input.label = 'Buscar por nome do cargo';
	input.queryParam = { name: 'searchQuery', value: '' };
	return input;
};

export const getFilterButtons = (): InputFilter[] => {
	let inputs: InputFilter[] = [];
	let input: InputFilter;

	input = new InputFilter();
	input.label = 'Em análise';
	input.queryParam = { name: 'status', value: AllocationRequestStatusEnum.IN_ANALYSIS };
	inputs.push(input);

	input = new InputFilter();
	input.label = 'Alocado';
	input.queryParam = { name: 'status', value: AllocationRequestStatusEnum.ALLOCATED };
	inputs.push(input);

	// input = new InputFilter();
	// input.label = 'Rejeitado';
	// input.queryParam = { name: 'status', value: AllocationRequestStatusEnum.REJECTED };
	// inputs.push(input);

	input = new InputFilter();
	input.label = 'Cancelado';
	input.queryParam = { name: 'status', value: AllocationRequestStatusEnum.CANCELLED };
	inputs.push(input);

	return inputs;
};

// export type AllocationRequestTableRow = ...
