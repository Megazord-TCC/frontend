import { Page } from "../models/pagination-models";

// Tipo para a linha da tabela de critérios
export interface CriterionTableRow {
  id: number;
  name: string;
  description: string;
  criteriaGroupId: number;
  weight: number;
  disabled: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  strategicObjectives?: any[];
}

// Mapeia um CriterionReadDTO para CriterionTableRow
export const mapCriterionDtoToCriterionTableRow = (dto: any): CriterionTableRow => {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    criteriaGroupId: dto.criteriaGroupId,
    weight: dto.weight,
    disabled: dto.disabled,
    createdAt: dto.createdAt,
    lastModifiedAt: dto.lastModifiedAt,
    strategicObjectives: dto.strategicObjectives.name
  };
}

// Mapeia uma página de CriterionReadDTO para Page<CriterionTableRow>
export const mapCriterionPageDtoToCriterionTableRowPage = (pageDto: any): Page<CriterionTableRow> => {
  return {
    ...pageDto,
    content: pageDto.content.map((criterionDTO: any) => mapCriterionDtoToCriterionTableRow(criterionDTO))
  };
}
