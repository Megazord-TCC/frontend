import { AllocationRequestReadDTO, AllocationRequestCreateDTO, AllocationRequestUpdateDTO } from '../interface/allocation-request-interfaces';

// Exemplo de função para mapear DTO para modelo interno (caso necessário)
export function toAllocationRequestModel(dto: AllocationRequestReadDTO) {
	return { ...dto };
}

// Interface para linha da tabela de allocation request
export type AllocationRequestTableRow = {
  id: number;
  projeto: string;
  cargoDesejado: string;
  horasDia: number;
  solicitante: string;
  inicio: string;
  fim: string;
  prioridade: string;
  status: string;
  desabilitado: boolean;
};

// Função para traduzir status
function traduzirStatus(status: string | undefined): string {
	if (!status) return '-';
	switch (status) {
		case 'IN_ANALYSIS': return  'EM ANÁLISE';
		case 'ALLOCATED': return 'ALOCADO';
		case 'REJECTED': return 'REJEITADO';
		case 'CANCELLED': return 'CANCELADO';
		default: return status;
	}
}

// Função para traduzir prioridade
function traduzirPrioridade(priority: string | undefined): string {
	if (!priority) return '-';
	switch (priority) {
		case 'LOW': return 'Baixa';
		case 'MEDIUM': return 'Média';
		case 'HIGH': return 'Alta';
		default: return priority;
	}
}

// Mapeia AllocationRequestReadDTO para AllocationRequestTableRow
export function mapAllocationRequestReadDTOToTableRow(dto: AllocationRequestReadDTO): AllocationRequestTableRow {
  return {
    id: dto.id,
    projeto: dto.project?.name ?? '-',
    cargoDesejado: dto.position?.name ?? '-',
    horasDia: dto.dailyHours ?? 0,
    solicitante: dto.createdBy?? '-',
    inicio: dto.startDate ?? '-',
    fim: dto.endDate ?? '-',
    prioridade: traduzirPrioridade(dto.priority),
    status: traduzirStatus(dto.status),
    desabilitado: dto.disabled ?? false
  };
}

// Mapeia uma página de AllocationRequestReadDTO para Page<AllocationRequestTableRow>
export function mapAllocationRequestReadDTOPageToTableRowPage(page: any): any {
	return {
		...page,
		content: page.content.map((allocationRequest: any) => mapAllocationRequestReadDTOToTableRow(allocationRequest))
	};
}

export function fromCreateForm(form: any): AllocationRequestCreateDTO {
	return {
		startDate: form.startDate,
		endDate: form.endDate,
		dailyHours: form.dailyHours,
		priority: form.priority,
		positionId: form.positionId,
		projectId: form.projectId
	};
}

export function fromUpdateForm(form: any): AllocationRequestUpdateDTO {
	return {
		startDate: form.startDate,
		endDate: form.endDate,
		dailyHours: form.dailyHours,
		priority: form.priority,
		positionId: form.positionId
	};
}
