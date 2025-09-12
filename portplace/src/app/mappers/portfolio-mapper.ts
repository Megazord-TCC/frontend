import { format } from "path";
import { formatToBRL } from "../helpers/money-helper";
import { PortfolioCostStatus, PortfolioDTOHealthEnum, PortfolioDTOStatus, PortfolioListReadDTO, PortfolioProgressStatus, PortfolioReadDTO, PortfolioSummaryTab, PortfolioTableRow, PortfolioTableRowStatus } from "../interface/carlos-portfolio-interfaces";
import { Page } from "../models/pagination-models";
import { PortfolioProjectTableRow, PortfolioProjectTableRowProjectStatus, ProjectReadDTO2 } from "../interface/carlos-project-dtos";

export const mapPortfolioDTOStatusToBadgeStatusColor = (status?: PortfolioDTOStatus): string => {
    switch(status) {
        case PortfolioDTOStatus.VAZIO: return 'blue'
        case PortfolioDTOStatus.EM_ANDAMENTO: return 'yellow';
        case PortfolioDTOStatus.FINALIZADO: return 'green';
        case PortfolioDTOStatus.CANCELADO: return 'gray';
        default: return 'blue';
    }
}

export function mapPortfolioDTOStatusToText(status: PortfolioDTOStatus | undefined): PortfolioTableRowStatus {
    switch(status) {
        case PortfolioDTOStatus.VAZIO: return PortfolioTableRowStatus.VAZIO;
        case PortfolioDTOStatus.EM_ANDAMENTO: return PortfolioTableRowStatus.EM_ANDAMENTO;
        case PortfolioDTOStatus.FINALIZADO: return PortfolioTableRowStatus.FINALIZADO;
        case PortfolioDTOStatus.CANCELADO: return PortfolioTableRowStatus.CANCELADO;
        default: return PortfolioTableRowStatus.CARREGANDO;
    }
}

export function mapPortfolioDTOToPortfolioTableRow(dto: PortfolioListReadDTO): PortfolioTableRow {
    const row = new PortfolioTableRow();
    row.id = dto.id;
    row.name = dto.name;
    row.budget = formatToBRL(dto.budget);
    row.projectsInProgress = dto.inProgressProjectsCount;
    row.projectsCompleted = dto.completedProjectsCount;
    row.projectsCancelled = dto.cancelledProjectsCount;
    row.status = mapPortfolioDTOStatusToText(dto.status);
    return row;
}

export function mapPortfolioDTOPageToPortfolioTableRowPage(portfolioPage: Page<PortfolioListReadDTO>): Page<PortfolioTableRow> {
    return {
        ...portfolioPage,
        content: portfolioPage.content.map(mapPortfolioDTOToPortfolioTableRow)
    };
}

export function mapPortfolioDTOHealthEnumToPortfolioCostStatus(dtoHealth?: string): PortfolioCostStatus | undefined {
    switch(dtoHealth) {
        case PortfolioDTOHealthEnum.GREEN: return PortfolioCostStatus.WITHIN_BUDGET;
        case PortfolioDTOHealthEnum.RED: return PortfolioCostStatus.OVER_BUDGET;
        default: return undefined;
    }
}

export function mapPortfolioDTOHealthEnumToPortfolioProgressStatus(dtoHealth?: string): PortfolioProgressStatus | undefined {
    switch(dtoHealth) {
        case PortfolioDTOHealthEnum.GREEN: return PortfolioProgressStatus.ON_TRACK;
        case PortfolioDTOHealthEnum.RED: return PortfolioProgressStatus.BEHIND_SCHEDULE;
        default: return undefined;
    }
}

export function mapPortfolioReadDTOToPortfolioSummaryTab(dto: PortfolioReadDTO): PortfolioSummaryTab {
    return {
        portfolioId: dto.id,
        budget: formatToBRL(dto.budget),
        costStatus: mapPortfolioDTOHealthEnumToPortfolioCostStatus(dto.budgetHealth),
        progressStatus: mapPortfolioDTOHealthEnumToPortfolioProgressStatus(dto.scheduleHealth),
        strategyName: dto.strategy?.name ?? 'Sem estratégia',
        responsibleUserNames: dto.owners.map(owner => owner.name),
    };
}

export function mapProjectStatusEnumDTO2ToPortfolioProjectTableRowProjectStatus(status?: string): PortfolioProjectTableRowProjectStatus | undefined {
    switch(status) {
        case 'IN_ANALYSIS': return PortfolioProjectTableRowProjectStatus.IN_ANALYSIS;
        case 'IN_PROGRESS': return PortfolioProjectTableRowProjectStatus.IN_PROGRESS;
        case 'COMPLETED': return PortfolioProjectTableRowProjectStatus.COMPLETED;
        case 'CANCELLED': return PortfolioProjectTableRowProjectStatus.CANCELLED;
        default: return undefined;
    }
}

export function mapProjectReadDTO2PageToPortfolioProjectTableRowPage(page: Page<ProjectReadDTO2>): Page<PortfolioProjectTableRow> {
    return {
        ...page,
        content: page.content.map(project => ({
            id: project.id,
            name: project.name,
            budget: formatToBRL(project.budgetAtCompletion),
            status: mapProjectStatusEnumDTO2ToPortfolioProjectTableRowProjectStatus(project.status),
            startDate: project.startDate ?? 'Erro',
            endDate: project.endDate ?? 'Erro',
            plannedValue: formatToBRL(project.plannedValue),
            earnedValue: formatToBRL(project.earnedValue),
        }))
    };
}

