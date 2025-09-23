
// Linha da tabela: Portfólio > Aba Comunicação > Aba Partes Interessadas
export class PortfolioStakeholderTableRow {
    id = 0;
    name = '';
    powerLevel?: PortfolioLevelScale;
    interestLevel?: PortfolioLevelScale;
}

export enum PortfolioLevelScale {
    HIGH = 'Alto',
    MEDIUM = 'Médio',
    LOW = 'Baixo'
}

export enum PortfolioScaleEnumDTO {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export class StakeholderReadDTO {
    id = 0;
    name = '';
    powerLevel?: PortfolioScaleEnumDTO;
    powerLevelJustification = '';
    interestLevel?: PortfolioScaleEnumDTO;
    interestLevelJustification = '';
    expectations = '';
    obligationsWithStakeholder = '';
    positivePoints = '';
    negativePoints = '';
    portfolioId = 0;
    createdAt = '';
    lastModifiedAt = '';
    createdBy = '';
    lastModifiedBy = '';
    disabled = false;
}

export class StakeholderCreateDTO {   
    name = '';
    portfolioId = 0;
}

export class StakeholderUpdateDTO {
    name = '';
    powerLevel?: PortfolioScaleEnumDTO;
    powerLevelJustification = '';
    interestLevel?: PortfolioScaleEnumDTO;
    interestLevelJustification = '';
    expectations = '';
    obligationsWithStakeholder = '';
    positivePoints = '';
    negativePoints = ''; 
}