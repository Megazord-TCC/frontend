export interface ResourceReadDTO {
    id: number;
    name: string;
    description?: string;
    dailyHours?: number;
    status?: string;
    relatedProjectsCount?: number;
    availableHours?: number;
    position?: PositionReadDTO;
    createdBy?: string;
    lastModifiedBy?: string;
    createdAt?: string;
    lastModifiedAt?: string;
    disabled?: boolean;
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
    status?: string;
}

export interface PositionReadDTO {
    id: number;
    name: string;
    description?: string;
}
