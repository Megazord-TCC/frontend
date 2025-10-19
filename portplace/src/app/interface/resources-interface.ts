export interface ResourceReadDTO {
    id: number;
    name: string;
    description?: string;
    dailyHours?: number;
    status?: ResourceStatusEnum;
    relatedProjectsCount?: number;
    availableHours?: number;
    position?: PositionReadDTO;
    createdBy?: string;
    lastModifiedBy?: string;
    createdAt?: string;
    lastModifiedAt?: string;
    disabled?: boolean;
}

export enum ResourceStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface ResourceCreateDTO {
    name: string;
    description?: string;
    dailyHours: number;
    positionId: number;
}

export interface ResourceUpdateDTO {
    name: string;
    description?: string;
    dailyHours: number;
    positionId?: number;
    status?: ResourceStatusEnum;
}

export interface PositionReadDTO {
    id: number;
    name: string;
    description?: string;
}
