export interface PositionReadDTO {
    id: number;
    name: string;
    status?: string;
    resourcesCount?: number;
    disabled?: boolean;
    createdAt?: string;
    lastModifiedAt?: string;
    createdBy?: string;
    lastModifiedBy?: string;
}

export interface PositionCreateDTO {
    name: string;
}

export interface PositionUpdateDTO {
    name: string;
    status?: string;
}
