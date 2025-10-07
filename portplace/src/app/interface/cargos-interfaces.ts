export interface PositionReadDTO {
    id: number;
    name: string;
    status?: PositionStatusEnum;
    resourcesCount?: number;
    disabled?: boolean;
    createdAt?: string;
    lastModifiedAt?: string;
    createdBy?: string;
    lastModifiedBy?: string;
}
export enum PositionStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export interface PositionCreateDTO {
    name: string;
}

export interface PositionUpdateDTO {
    name: string;
    status?: string;
}
