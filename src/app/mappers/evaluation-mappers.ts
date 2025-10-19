// Mapeia os valores do enum EvaluationGroupStatusEnum para texto exibido na tabela
export const mapEvaluationGroupStatusEnumToText = (statusEnum: any): string => {
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

import { EvaluationGroupView } from '../interface/interfacies';

// Mapper para converter o DTO do backend para o modelo usado na tabela de grupos de avaliação
export function mapEvaluationGroupDtoToEvaluationGroupTableRow(dto: any): EvaluationGroupView {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    criteriaGroupId: dto.criteriaGroupId,
    status: dto.status,
    statusText: mapEvaluationGroupStatusEnumToText(dto.status),
    disabled: dto.disabled,
    createdAt: dto.createdAt,
    lastModifiedAt: dto.lastModifiedAt,
    criteriaGroup: dto.criteriaGroup.name,
    evaluations: dto.evaluations,
    statusColor: getStatusColor(dto.status) as 'green' | 'gray' | 'red'
  };
}

// Função auxiliar para cor do status
function getStatusColor(status: string): 'green' | 'gray' | 'red' {
  switch (status) {
    case 'ATIVO':
    case 'ACTIVE':
      return 'green';
    case 'CANCELADO':
    case 'CANCELLED':
      return 'gray';
    case 'INATIVO':
    case 'DISABLED':
      return 'red';
    default:
      return 'gray';
  }
}

// Mapper para página de grupos de avaliação
export function mapEvaluationGroupPageDtoToEvaluationGroupTableRowPage(page: any) {
  return {
    ...page,
    content: page.content?.map(mapEvaluationGroupDtoToEvaluationGroupTableRow) || []
  };
}
