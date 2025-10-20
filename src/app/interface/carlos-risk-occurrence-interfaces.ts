
export enum RiskOccurrenceStatus {
    NOT_SOLVED = 'Não resolvido',
    SOLVED = 'Resolvido'
}

export enum RiskOccurrenceStatusEnumDTO {
    NOT_SOLVED = 'NOT_SOLVED',
    SOLVED = 'SOLVED'
}

export class RiskOccurrenceTableRow {
    id = 0;
    dateOfOccurrence = '';
    description = '';
    daysToSolve = 0;
    status?: RiskOccurrenceStatus;
}

export class RiskOccurrenceReadDTO {
    id = 0;
    description = '';
    dateOfOccurrence = '';
    status?: RiskOccurrenceStatusEnumDTO;
    solvedAt = '';
    daysToSolve = 0;
    riskId = 0;
    disabled = false;
    createdBy = '';
    createdAt = '';
    lastModifiedBy = '';
    lastModifiedAt = '';
    followedContingencyPlan = false;
    contingencyActions: string | null = null;
}

export class RiskOccurrenceUpdateDTO {
    description = '';
    dateOfOccurrence = '';
    solvedAt: string | null = null;
    followedContingencyPlan = false;
    contingencyActions: string | null = null;
}

export class RiskOccurrenceCreateDTO {
    description = '';
    dateOfOccurrence = '';
    solvedAt: string | null = null;
    riskId = 0;
    followedContingencyPlan = false;
    contingencyActions: string | null = null;
}