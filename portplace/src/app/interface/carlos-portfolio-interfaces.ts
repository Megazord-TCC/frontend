import { ProjectReadDTO } from "./carlos-project-dtos";
import { StrategyReadDTO } from "./carlos-strategy-dtos";
import { UserGetResponseDTO } from "./carlos-user-dtos";

export enum PortfolioTableRowStatus {
    VAZIO = 'VAZIO',
    EM_ANDAMENTO = 'EM ANDAMENTO',
    FINALIZADO = 'FINALIZADO',
    CANCELADO = 'CANCELADO',
    CARREGANDO = '...'
}

// A uma linha da tabela da página "Início > Portfólios".
export class PortfolioTableRow {
    id = 0;
    name = '';
    budget = '0,00';
    projectsInProgress = 0;
    projectsCompleted = 0;
    projectsCancelled = 0;
    status?: PortfolioTableRowStatus;
}

export enum PortfolioDTOStatus {
    VAZIO = 'EMPTY',
    EM_ANDAMENTO = 'IN_PROGRESS',
    FINALIZADO = 'COMPLETED',
    CANCELADO = 'CANCELLED' // Provavelmente será quando cancela todos projetos do portfólio,
    // provavelmente será apenas um status 'calculado'.
}

export enum PortfolioDTOHealthEnum {
    RED = 'RED',
    YELLOW = 'YELLOW',
    GREEN = 'GREEN'
}

export class PortfolioReadDTO {
    id = 0;
    name = '';
    description = '';
    budget = 0;
    status?: PortfolioDTOStatus;
    projects: ProjectReadDTO[] = [];
    strategy?: StrategyReadDTO;
    owners: UserGetResponseDTO[] = [];
    scheduleHealth?: PortfolioDTOHealthEnum;
    budgetHealth?: PortfolioDTOHealthEnum;
    createdBy = '';
    lastModifiedBy = '';
    createdAt = '';
    lastModifiedAt?: '';
    canBeDeleted = false;
    activeScenarioName = '';
    cancellationReason = '';
}

export enum PortfolioProgressStatus {
    BEHIND_SCHEDULE = 'Atrasado',
    ON_TRACK = 'Dentro do prazo',
}

export enum PortfolioCostStatus {
    OVER_BUDGET = 'Acima do planejado',
    WITHIN_BUDGET = 'Dentro do planejado'
}

export class PortfolioSummaryTab {
    portfolioId = 0;
    budget = '0,00';
    costStatus?: PortfolioCostStatus;
    progressStatus?: PortfolioProgressStatus;
    strategyName = '...';
    responsibleUserNames: string[] = [];
}

export class PortfolioListReadDTO {
    id = 0;
    name = '';
    budget = 0;
    status?: PortfolioDTOStatus;
    inProgressProjectsCount = 0;
    completedProjectsCount = 0;
    cancelledProjectsCount = 0;
}

export class PortfolioUpdateDTO {
    name = '';
    description = '';
}

export class PortfolioCancelationPatchDTO {
    cancellationReason = '';
}