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
    budget = 0;
    projectsInProgress = 0;
    projectsCompleted = 0;
    projectsCancelled = 0;
    status?: PortfolioDTOStatus;
}