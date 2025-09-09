import { Page } from "../models/pagination-models";

// Tipo para a linha da tabela de grupos de critérios
export interface CriteriaGroupTableRow {
  id: number;
  name: string;
  description: string;
  status: string;
  relatedObjectivesCount: number;
  relatedEvaluationGroupsCount: number;
  lastModifiedAt?: string;
  createdAt?: string;
  disabled?: boolean;
}

// Mapeia os valores do enum CriteriaGroupStatusEnum para texto exibido na tabela
export const mapCriteriaGroupStatusEnumToText = (statusEnum: any): string => {
  switch (statusEnum) {
    case "ACTIVE": return "ATIVO";
    case "INACTIVE": return "INATIVO";
    default: return "SEM STATUS";
  }
}

// Mapeia um CriteriaGroupReadDTO para CriteriaGroupTableRow
export const mapCriteriaGroupDtoToCriteriaGroupTableRow = (dto: any): CriteriaGroupTableRow => {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    status: mapCriteriaGroupStatusEnumToText(dto.status),
    relatedObjectivesCount: dto.relatedObjectivesCount,
    relatedEvaluationGroupsCount: dto.relatedEvaluationGroupsCount,
    lastModifiedAt: dto.lastModifiedAt,
    createdAt: dto.createdAt,
    disabled: dto.disabled
  };
}

// Mapeia uma página de CriteriaGroupReadDTO para Page<CriteriaGroupTableRow>
export const mapCriteriaGroupPageDtoToCriteriaGroupTableRowPage = (pageDto: any): Page<CriteriaGroupTableRow> => {
  return {
    ...pageDto,
    content: pageDto.content.map((criteriaGroupDTO: any) => mapCriteriaGroupDtoToCriteriaGroupTableRow(criteriaGroupDTO))
  };
}
