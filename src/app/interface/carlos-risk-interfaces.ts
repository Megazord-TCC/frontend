import { RiskOccurrenceReadDTO } from "./carlos-risk-occurrence-interfaces";

export class PortfolioRisksTableRow {
    id = 0;
    name = '';
    severity = '';
    unresolvedOccurrencesCount = 0;
    probability?: RiskScale;
    impact?: RiskScale
}

export enum RiskScale {
    LOW = '1 - Baixo',
    MEDIUM = '2 - Médio',
    HIGH = '3 - Alto',
    VERY_HIGH = '4 - Muito alto'
}

export enum RiskScaleEnumDTO {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}


export class RiskReadDTO {
    id = 0;
    name = '';
    description = '';
    probability?: RiskScaleEnumDTO;
    probabilityDescription = '';
    impact?: RiskScaleEnumDTO;
    impactDescription = '';
    preventionPlan = '';
    contingencyPlan = '';
    severity = 0;
    portfolioId = 0;
    occurrences?: RiskOccurrenceReadDTO[];
    disabled = false;
    createdAt = '';
    createdBy = '';
    lastModifiedAt = '';
    lastModifiedBy = '';
}

export class RiskCreateDTO {
    name = '';
    description = '';
    portfolioId = 0;
}

export class RiskUpdateDTO {
    name = '';
    description = '';
    probability?: RiskScaleEnumDTO;
    probabilityDescription = '';
    impact?: RiskScaleEnumDTO;
    impactDescription = '';
    preventionPlan = '';
    contingencyPlan = '';
    // severity = 0;
    disabled = false;
    // createdAt = '';
    // lastModifiedAt = '';
    // createdBy = '';
    // lastModifiedBy = '';
}