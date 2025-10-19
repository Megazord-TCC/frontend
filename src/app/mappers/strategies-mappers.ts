import { Page } from "../models/pagination-models";

// Tipo para a linha da tabela de estratégias
export interface StrategyTableRow {
	id: number;
	name: string;
	description: string;
	status: string;
	activeObjectivesCount: number;
}

// Mapeia os valores do enum StrategyStatusEnum para texto exibido na tabela
export const mapStrategyStatusEnumToText = (statusEnum: any): string => {
	switch (statusEnum) {
		case "ACTIVE": return "ATIVO";
		case "INACTIVE": return "INATIVO";
		default: return "SEM STATUS";
	}
}

// Mapeia um StrategyReadDTO para StrategyTableRow
export const mapStrategyDtoToStrategyTableRow = (dto: any): StrategyTableRow => {
	return {
		id: dto.id,
		name: dto.name,
		description: dto.description,
		status: mapStrategyStatusEnumToText(dto.status),
		activeObjectivesCount: dto.activeObjectivesCount
	};
}

// Mapeia uma página de StrategyReadDTO para Page<StrategyTableRow>
export const mapStrategyPageDtoToStrategyTableRowPage = (pageDto: any): Page<StrategyTableRow> => {
	return {
		...pageDto,
		content: pageDto.content.map((strategyDTO: any) => mapStrategyDtoToStrategyTableRow(strategyDTO))
	};
}
