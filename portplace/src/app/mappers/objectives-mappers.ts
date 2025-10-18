// Mapeia os valores do enum StrategicObjectiveStatusEnum para texto exibido na tabela
export const mapStrategicObjectiveStatusEnumToText = (statusEnum: any): string => {
	switch (statusEnum) {
		case 'IDLE':
		case 'PARADO':
			return 'PARADO';
		case 'ACTIVE':
		case 'ATIVO':
			return 'ATIVO';
		case 'COMPLETED':
		case 'CONCLUÍDO':
			return 'CONCLUÍDO';
		case 'CANCELLED':
		case 'CANCELADO':
			return 'CANCELADO';
		case 'ON_HOLD':
		case 'PAUSADO':
			return 'PAUSADO';
		default:
			return 'SEM STATUS';
	}
}
import { Objective } from '../interface/interfacies';

// Mapper para converter o DTO do backend para o modelo usado na tabela de objetivos
export function mapObjectiveDtoToObjectiveTableRow(dto: any): Objective {
	return {
		id: dto.id,
		name: dto.name,
		description: dto.description,
		status:mapStrategicObjectiveStatusEnumToText(dto.status),
		strategyId: dto.strategyId,
		criteriaCount: dto.criteriaCount,
		activePortfolioCount: dto.activePortfolioCount,
		activeProjectsCount: dto.activeProjectsCount,
		disabled: dto.disabled,
		createdAt: dto.createdAt,
		lastModifiedAt: dto.lastModifiedAt,
		statusColor: getStatusColor(dto.status) as 'green' | 'gray' | 'red'
	};
}

// Função auxiliar para cor do status
function getStatusColor(status: string): 'green' | 'gray' | 'red' {
	switch (status) {
		case 'ATIVADO':
			return 'green';
		case 'CANCELADO':
			return 'gray';
		case 'INATIVO':
			return 'red';
		default:
			return 'gray';
	}
}

// Mapper para página de objetivos
export function mapObjectivePageDtoToObjectiveTableRowPage(page: any) {
	return {
		...page,
		content: page.content?.map(mapObjectiveDtoToObjectiveTableRow) || []
	};
}
