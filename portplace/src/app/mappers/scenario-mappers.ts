import { getMonthFromDateFormatDDMMYYYY, getYearFromDateFormatDDMMYYYY } from "../helpers/date-helper";
import { formatToBRL } from "../helpers/money-helper";
import { ScenarioProject, ScenariosTableRow } from "../interface/carlos-interfaces";
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioStatusEnum } from "../interface/carlos-scenario-dtos";
import { Page } from "../models/pagination-models";

export const mapScenarioStatusToBadgeStatusColor = (scenarioStatusEnum: string): string => {
    switch(scenarioStatusEnum) {
        case "AUTHORIZED": return 'green';
        case "CANCELLED": return 'gray';
        case "WAITING_AUTHORIZATION": return 'yellow';
        default: return 'blue';
    }
}

// Mapeia os valores do enum ScenarioStatusEnum (definido no backend) para strings exibidas em tabelas.
export const mapScenarioStatusEnumToText = (scenarioStatusEnum: any): string => {
    switch(scenarioStatusEnum) {
        case "WAITING_AUTHORIZATION": return 'AGUARDANDO AUTORIZAÇÃO';
        case "AUTHORIZED": return 'AUTORIZADO';
        case "CANCELLED": return 'CANCELADO';
        default: return 'ERRO';
    }
}

// Mapeia um objeto DTO retornado pelo backend (que representa um cenário) para o objeto exibido
// na tabela da aba de cenários da tela de estratégia específica.
export const  mapScenarioDtoToScenarioTableRow = (dto: ScenarioReadDTO): ScenariosTableRow => {
    return {
        id: dto.id,
        name: dto.name,
        budget: formatToBRL(dto.budget),
        includedProjectsQuantity: dto.scenarioRankings.filter(ranking => ranking.status == ScenarioRankingStatusEnum.INCLUDED).length,
        status: mapScenarioStatusEnumToText(dto.status),
        evaluationGroupName: dto.evaluationGroup?.name ?? '...',
    };
}

// Mapeia um objeto Page DTO retornado pelo backend (que representa uma página de cenários) 
// para o objeto Page que contém uma página de ScenariosTableRow (que é o objeto exibido 
// na tabela da aba de cenários da tela de estratégia específica).
export const mapScenarioPageDtoToScenariosTableRowPage = (pageDto: any): Page<ScenariosTableRow> => {
    return {
        ...pageDto, 
        content: pageDto.content.map((scenarioDTO: ScenarioReadDTO) => (mapScenarioDtoToScenarioTableRow(scenarioDTO)))
    };
}

const getProjectDurationMonthsText = (project: any): string => {
    if (!project.startDate || !project.endDate)
        return 'Erro';

    let startDateYear = getYearFromDateFormatDDMMYYYY(project.startDate);
    let startDateMonth = getMonthFromDateFormatDDMMYYYY(project.startDate);
    let endDateYear = getYearFromDateFormatDDMMYYYY(project.endDate);
    let endDateMonth = getMonthFromDateFormatDDMMYYYY(project.endDate);

    const years = endDateYear - startDateYear;
    const months = endDateMonth - startDateMonth;
    const quantityMonths = (years * 12) + months;

    return quantityMonths >= 2 ? `${quantityMonths} meses` : `${quantityMonths} mês`;
}

export const mapProjectStatusEnumToText = (projectStatusEnum: any): string => {
    switch(projectStatusEnum) {
        case 'IN_ANALYSIS': return 'EM ANÁLISE';
        case 'IN_PROGRESS': return 'EM ANDAMENTO';
        case 'COMPLETED': return 'FINALIZADO';
        case 'CANCELLED': return 'CANCELADO';
        default: return 'ERRO';
    }
}

export const mapScenarioRankingDtoToScenarioProject = (scenarioRankingDto: any): ScenarioProject => {
    return {
        scenarioRankingId: scenarioRankingDto.id,
        currentOrder: scenarioRankingDto.currentPosition,
        initialOrder: scenarioRankingDto.calculatedPosition,
        projectName: scenarioRankingDto?.project?.name ?? 'Erro',
        inclusionStatus: scenarioRankingDto.status,
        strategicValue: scenarioRankingDto.totalScore,
        estimatedCost: formatToBRL(scenarioRankingDto.project.estimateAtCompletion ?? 0),
        portfolioCategoryId: scenarioRankingDto?.portfolioCategory?.id ?? '',
        durationMonths: getProjectDurationMonthsText(scenarioRankingDto.project),
        projectStatus: mapProjectStatusEnumToText(scenarioRankingDto.project.status),
    };
}

export const mapScenarioRankingsPageDtoToScenarioProjectsPage = (pageDto: any): Page<ScenarioProject> => {
    return {
        ...pageDto, 
        content: pageDto.content.map((scenarioRankingDTO: any) => (mapScenarioRankingDtoToScenarioProject(scenarioRankingDTO)))
    };
}