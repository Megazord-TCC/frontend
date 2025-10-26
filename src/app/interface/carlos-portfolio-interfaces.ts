import { ProjectReadDTO } from "./carlos-project-dtos";
import { StrategyReadDTO } from "./carlos-strategy-dtos";
import { UserGetResponseDTO } from "./carlos-user-dtos";
export class RiskOccurrenceReadDTO {
    id: number = 0;
    description: string = '';
    dateOfOccurrence: string = '';
    status?: RiskOccurrenceStatusEnum;
    solvedAt: string = '';
    daysToSolve: number = 0;
    riskId: number = 0;
    disabled: boolean = false;
    createdBy: string = '';
    createdAt: string = '';
    lastModifiedBy: string = '';
    lastModifiedAt: string = '';
}

export enum RiskOccurrenceStatusEnum {
    SOLVED = 'RESOLVIDO',
    NOT_SOLVED = 'NÃO RESOLVIDO'
}

export class RiskReadDTO {
    id: number = 0;
    name: string = '';
    description: string = '';
    probability: number = 0;
    probabilityDescription: string = '';
    impact: number = 0;
    impactDescription: string = '';
    preventionPlan: string = '';
    contingencyPlan: string = '';
    severity: number = 0;
    portfolioId: number = 0;
    occurrences: RiskOccurrenceReadDTO[] = [];
    disabled: boolean = false;
    createdAt: string = '';
    createdBy: string = '';
    lastModifiedAt: string = '';
    lastModifiedBy: string = '';
}

export enum RiskSeverityEnum {
    LOW = 'BAIXA',
    MEDIUM = 'MÉDIA',
    HIGH = 'ALTA',
    VERY_HIGH = 'MUITO ALTA'
}

export class PortfolioAnalyticsReadDTO {
    portfolio!: PortfolioReadDTO;
    projects: ProjectReadDTO[] = [];
    risks: RiskReadDTO[] = [];
}

export enum PortfolioTableRowStatus {
    VAZIO = 'VAZIO',
    EM_ANDAMENTO = 'EM ANDAMENTO',
    FINALIZADO = 'CONCLUÍDO',
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
    communicationStorageDescription = '';
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
    communicationStorageDescription = '';
}

export class PortfolioCancelationPatchDTO {
    cancellationReason = '';
}
