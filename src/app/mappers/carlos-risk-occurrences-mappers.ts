import { Page } from "../models/pagination-models";
import { RiskOccurrenceReadDTO, RiskOccurrenceStatus, RiskOccurrenceStatusEnumDTO, RiskOccurrenceTableRow } from "../interface/carlos-risk-occurrence-interfaces";

export function mapRiskOccurrenceStatusEnumDTOToRiskOccurrenceStatus(status?: RiskOccurrenceStatusEnumDTO): RiskOccurrenceStatus | undefined {
    switch (status) {
        case RiskOccurrenceStatusEnumDTO.NOT_SOLVED: return RiskOccurrenceStatus.NOT_SOLVED;
        case RiskOccurrenceStatusEnumDTO.SOLVED: return RiskOccurrenceStatus.SOLVED;
        default: return undefined;
    }
}

// Recebe string e quebra ela até o limite e adiciona 3 pontos ao final se for maior
export function truncateString(str: string, maxLength: number): string {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + '...';
    }
    return str;
}

export function getBadgeColorByRiskOccurrenceCount(count: number): string {
    if (count == 0) return 'green';
    return 'red';
}

export function mapRiskOccurrenceReadDTOToRiskOccurrenceTableRow(dto: RiskOccurrenceReadDTO): RiskOccurrenceTableRow {
    return {
        id: dto.id,
        description: truncateString(dto.description, 50),
        dateOfOccurrence: dto.dateOfOccurrence,
        daysToSolve: dto.daysToSolve,
        status: mapRiskOccurrenceStatusEnumDTOToRiskOccurrenceStatus(dto.status)
    };
}

export function mapRiskOccurrenceReadDTOPageToRiskOccurrenceTableRowPage(page: Page<RiskOccurrenceReadDTO>): Page<RiskOccurrenceTableRow> {
    return {
        ...page,
        content: page.content.map(occurrence => mapRiskOccurrenceReadDTOToRiskOccurrenceTableRow(occurrence))
    };
}