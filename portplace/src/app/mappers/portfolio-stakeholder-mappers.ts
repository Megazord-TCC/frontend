import { PortfolioLevelScale, PortfolioScaleEnumDTO, PortfolioStakeholderTableRow, StakeholderReadDTO } from "../interface/carlos-portfolio-stakeholders-interfaces";
import { Page } from "../models/pagination-models";

export function mapPortfolioLevelScaleToBadgeColor(scale?: PortfolioLevelScale): string {
    switch (scale) {
        case PortfolioLevelScale.HIGH: return 'red';
        case PortfolioLevelScale.MEDIUM: return 'yellow';
        case PortfolioLevelScale.LOW: return 'gray';
        default: return 'default';
    }
}

export function mapPortfolioLevelScaleToPortfolioScaleEnumDTO(scale?: PortfolioLevelScale): PortfolioScaleEnumDTO | undefined {
    switch (scale) {
        case PortfolioLevelScale.HIGH: return PortfolioScaleEnumDTO.HIGH;
        case PortfolioLevelScale.MEDIUM: return PortfolioScaleEnumDTO.MEDIUM;
        case PortfolioLevelScale.LOW: return PortfolioScaleEnumDTO.LOW;
        default: return undefined;
    }
}

export function mapPortfolioScaleEnumDTOToPortfolioLevelScale(dto?: PortfolioScaleEnumDTO): PortfolioLevelScale | undefined {
    switch (dto) {
        case PortfolioScaleEnumDTO.HIGH: return PortfolioLevelScale.HIGH;
        case PortfolioScaleEnumDTO.MEDIUM: return PortfolioLevelScale.MEDIUM;
        case PortfolioScaleEnumDTO.LOW: return PortfolioLevelScale.LOW;
        default: return undefined;
    }
}

export function mapStakeholderReadDTOToPortfolioStakeholderTableRow(dto: StakeholderReadDTO): PortfolioStakeholderTableRow {
    return {
        id: dto.id,
        name: dto.name,
        powerLevel: mapPortfolioScaleEnumDTOToPortfolioLevelScale(dto.powerLevel),
        interestLevel: mapPortfolioScaleEnumDTOToPortfolioLevelScale(dto.interestLevel)
    };
}

export function mapStakeholderReadDTOPageToPortfolioStakeholderTableRowPage(dto: Page<StakeholderReadDTO>): Page<PortfolioStakeholderTableRow> {
    return {
        ...dto,
        content: dto.content.map(stakeholder => mapStakeholderReadDTOToPortfolioStakeholderTableRow(stakeholder))
    };
}