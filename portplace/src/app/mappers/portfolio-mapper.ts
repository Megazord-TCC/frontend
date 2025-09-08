import { formatToBRL } from "../helpers/money-helper";
import { PortfolioDTO, PortfolioDTOStatus, PortfolioTableRow, PortfolioTableRowStatus } from "../interface/carlos-portfolio-interfaces";
import { Page } from "../models/pagination-models";

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

export function mapPortfolioDTOToPortfolioTableRow(dto: PortfolioDTO): PortfolioTableRow {
    const row = new PortfolioTableRow();
    row.id = dto.id;
    row.name = dto.name;
    row.budget = formatToBRL(dto.budget);
    row.projectsInProgress = dto.projectsInProgress;
    row.projectsCompleted = dto.projectsCompleted;
    row.projectsCancelled = dto.projectsCancelled;
    row.status = mapPortfolioDTOStatusToText(dto.status);
    return row;
}

export function mapPortfolioDTOPageToPortfolioTableRowPage(portfolioPage: Page<PortfolioDTO>): Page<PortfolioTableRow> {
    return {
        ...portfolioPage,
        content: portfolioPage.content.map(mapPortfolioDTOToPortfolioTableRow)
    };
}
