import { Page } from "../models/pagination-models";
import { Project } from '../interface/interfacies';

// Mapper para converter o DTO do backend para o modelo Project
export function mapProjectDtoToProject(dto: any): Project {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    status: mapProjectStatusEnumToText(dto.status),
    payback: dto.payback,
    roi: dto.roi,
    startDate: dto.startDate,
    endDate: dto.endDate,
    plannedValue: dto.plannedValue,
    earnedValue: dto.earnedValue,
    actualCost: dto.actualCost,
    budgetAtCompletion: dto.budgetAtCompletion,
    percentComplete: dto.percentComplete,
    costPerformanceIndex: dto.costPerformanceIndex,
    schedulePerformanceIndex: dto.schedulePerformanceIndex,
    estimateAtCompletion: dto.estimateAtCompletion,
    estimateToComplete: dto.estimateToComplete,
    portfolioCategory: dto.portfolioCategory,
    portfolioName: dto.portfolioName,
    strategyName: dto.strategyName,
    scenarioRankingScore: dto.scenarioRankingScore,
    priorityInPortfolio: dto.priorityInPortfolio,
    strategicObjectives: dto.strategicObjectives,
    evaluations: dto.evaluations,
    createdAt: dto.createdAt,
    lastModifiedAt: dto.lastModifiedAt,
    disabled: dto.disabled
  };
}

// Tipo para a linha da tabela de projetos (ajuste conforme necessário)
export interface ProjectTableRow {
    id: number;
    name: string;
    portfolio: string;
    budget: number;
    earnedValue: number;
    plannedValue: number;
    startDate: string;
    endDate: string;
    status: string;
}

// Mapeia os valores do enum ProjectStatusEnum para texto exibido na tabela
export const mapProjectStatusEnumToText = (statusEnum: any): string => {
    switch (statusEnum) {
        case "IN_ANALYSIS": return "EM ANÁLISE";
        case "CANCELLED": return "CANCELADO";
        case "IN_PROGRESS": return "EM ANDAMENTO";
        case "COMPLETED": return "CONCLUÍDO";
        default: return "SEM STATUS";
    }
}



// Mapeia uma página de ProjectReadDTO para Page<ProjectTableRow>
export const mapProjectPageDtoToProjectTableRowPage = (pageDto: any): Page<ProjectTableRow> => {
    return {
        ...pageDto,
        content: pageDto.content.map((projectDTO: any) => mapProjectDtoToProject(projectDTO))
    };
}
