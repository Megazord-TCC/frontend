import { Page } from "../models/pagination-models";
import { PortfolioRisksTableRow, RiskReadDTO, RiskScale, RiskScaleEnumDTO } from "../interface/carlos-risk-interfaces";
import { RiskOccurrenceStatusEnumDTO } from "../interface/carlos-risk-occurrence-interfaces";

export function mapRiskScaleToRiskScaleEnumDTO(scale?: RiskScale): RiskScaleEnumDTO | undefined {
    switch (scale) {
        case RiskScale.LOW: return RiskScaleEnumDTO.LOW;
        case RiskScale.MEDIUM: return RiskScaleEnumDTO.MEDIUM;
        case RiskScale.HIGH: return RiskScaleEnumDTO.HIGH;
        case RiskScale.VERY_HIGH: return RiskScaleEnumDTO.VERY_HIGH;
        default: return undefined;
    }
}

export function mapRiskScaleEnumDTOToRiskScale(scale?: RiskScaleEnumDTO): RiskScale | undefined {
    switch (scale) {
        case RiskScaleEnumDTO.LOW: return RiskScale.LOW;
        case RiskScaleEnumDTO.MEDIUM: return RiskScale.MEDIUM;
        case RiskScaleEnumDTO.HIGH: return RiskScale.HIGH;
        case RiskScaleEnumDTO.VERY_HIGH: return RiskScale.VERY_HIGH;
        default: return undefined;
    }
}

export function mapRiskScaleEnumDTOToBadgeColor(scale?: RiskScaleEnumDTO): string {
    switch (scale) {
        case RiskScaleEnumDTO.LOW: return 'gray';
        case RiskScaleEnumDTO.MEDIUM: return 'yellow';
        case RiskScaleEnumDTO.HIGH: return 'orange';
        case RiskScaleEnumDTO.VERY_HIGH: return 'red';
        default: return 'gray';
    }
}

export function mapSeverityNumberToBadgeColor(severity?: number): string {
    const text = severityNumberToText(severity).toLowerCase();
    if (text?.includes('muito')) return 'red';
    if (text?.includes('alta')) return 'orange';
    if (text?.includes('média')) return 'yellow';
    if (text?.includes('baixa')) return 'gray';
    return 'gray';
}

export function severityNumberToText(severity?: number): string {
    switch (severity) {
        case 1:
        case 2: return `${severity} - Baixa`;
        case 3:
        case 4: return `${severity} - Média`;
        case 6:
        case 8:
        case 9: return `${severity} - Alta`;
        case 12:
        case 16: return `${severity} - Muito alta`;
        default: return `${severity} - Baixa`;
    }
}

export function mapRiskReadDTOToPortfolioRisksTableRow(dto: RiskReadDTO): PortfolioRisksTableRow {
    return {
        id: dto.id,
        name: dto.name,
        severity: severityNumberToText(dto.severity),
        unresolvedOccurrencesCount: dto.occurrences?.filter(o => o.status == RiskOccurrenceStatusEnumDTO.NOT_SOLVED).length || 0,
        probability: mapRiskScaleEnumDTOToRiskScale(dto.probability),
        impact: mapRiskScaleEnumDTOToRiskScale(dto.impact),
    };
}

export function mapRiskReadDTOPageToPortfolioRisksTableRowPage(page: Page<RiskReadDTO>): Page<PortfolioRisksTableRow> {
    return {
        ...page,
        content: page.content.map(risks => mapRiskReadDTOToPortfolioRisksTableRow(risks))
    };
}