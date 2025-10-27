
import { Page } from '../models/pagination-models';
import { ResourceReadDTO } from '../interface/resources-interface';

// Interface para linha da tabela de recursos
export interface ResourcesPositionTableRow {
	id: number;
	nome: string;
	cargo: string;
	horasDiaContrato: number;
	projetosVinculados: number;
	horasOciosas: number;
	status: string;
}

// Mapeia ResourceReadDTO para ResourcesPositionTableRow
export function mapResourceReadDTOToResourcesPositionTableRow(dto: ResourceReadDTO): ResourcesPositionTableRow {
	function traduzirStatus(status: string | undefined): string {
		if (!status) return '-';
		switch (status) {
			case 'ACTIVE': return 'ATIVO';
			case 'INACTIVE': return 'CANCELADO';
			default: return status;
		}
	}

	return {
		id: dto.id,
		nome: dto.name,
		cargo: dto.position?.name ?? '-',
		horasDiaContrato: dto.dailyHours ?? 0,
		projetosVinculados: dto.relatedProjectsCount ?? 0,
		horasOciosas: dto.availableHours ?? 0,
		status: traduzirStatus(dto.status)
	};
}

// Mapeia uma página de ResourceReadDTO para Page<ResourcesPositionTableRow>
export function mapResourceReadDTOPageToResourcesPositionTableRowPage(page: Page<ResourceReadDTO>): Page<ResourcesPositionTableRow> {
	return {
		...page,
		content: page.content.map(mapResourceReadDTOToResourcesPositionTableRow)
	};
}
