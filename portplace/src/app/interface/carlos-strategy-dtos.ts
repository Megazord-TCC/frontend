
export enum StrategyDTOStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export class StrategyReadDTO {
    id = 0;
    name = '';
    description = '';
    status?: StrategyDTOStatusEnum;
    activeObjectivesCount = 0;
    disabled = false;
    createdAt = new Date();
    lastModifiedAt?: Date;
}