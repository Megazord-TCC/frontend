import { UserGetResponseDTO } from "./carlos-user-dtos";

export enum ProjectStatusEnum {
    // TODO: Conferir esses 2 primeiros, pois não está de acordo com protótipo os status.
    CANDIDATE,
    PLANNING,
    IN_PROGRESS,
    FINISHED
}

export interface ProjectReadDTO {
    id: number;
    name: string;
    description: string;
    status: ProjectStatusEnum;
    earnedValue: number;
    plannedValue: number;
    actualCost: number;
    budget: number;
    payback: number;
    startDate: Date;
    endDate: Date;
    projectManager: UserGetResponseDTO;
    createdAt: Date;
    lastModifiedAt: Date;
    disabled: boolean;
}