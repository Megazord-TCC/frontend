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

export class PortfolioDTO {
    id = 0;
    name = '';
    description = '';
    budget = 0;
    projectsInProgress = 0;
    projectsCompleted = 0;
    projectsCancelled = 0;
    createdAt = new Date();
    lastModifiedAt?: Date;
    cancellationReason?: string;
    status?: PortfolioDTOStatus;
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