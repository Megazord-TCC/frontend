import { AllocationReadDTO } from '../interface/allocation-interfaces';

export type AllocationTableRow = {
  id: number;
  projeto: string;
  horasDia: number;
  solicitante: string;
  inicio: string;
  fim: string;
  prioridade: string;
  status: string;
};

function traduzirStatus(status: string | undefined): string {
  if (!status) return '-';
  switch (status) {
    case 'IN_ANALYSIS': return  'EM ANÁLISE';
    case 'ALLOCATED': return 'ALOCADO';
    case 'REJECTED': return 'REJEITADO';
    case 'CANCELLED': return 'CANCELADO';
    case 'COMPLETED': return 'CONCLUÍDO';
    default: return status;
  }
}

function traduzirPrioridade(priority: string | undefined): string {
  if (!priority) return '-';
  switch (priority) {
    case 'LOW': return 'Baixa';
    case 'MEDIUM': return 'Média';
    case 'HIGH': return 'Alta';
    default: return priority;
  }
}

export function mapAllocationReadDTOToTableRow(dto: AllocationReadDTO): AllocationTableRow {
  return {
    id: dto.id,
    projeto: dto.projectName ?? '-',
    horasDia: dto.dailyHours ?? 0,
    solicitante: dto.createdBy ?? '-',
    inicio: dto.startDate ?? '-',
    fim: dto.endDate ?? '-',
    prioridade: traduzirPrioridade((dto as any).priority),
    status: traduzirStatus((dto as any).status)
  };
}

export function mapAllocationReadDTOPageToTableRowPage(page: any): any {
  return {
    ...page,
    content: page.content.map((allocation: any) => mapAllocationReadDTOToTableRow(allocation))
  };
}
