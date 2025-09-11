import { PortfolioCategoryReadDTO } from "./carlos-category-interfaces";
import { UserGetResponseDTO } from "./carlos-user-dtos";

/** 
 * @deprecated Use ProjectStatusEnumDTO2 instead.
*/
export enum ProjectStatusEnum {
    // TODO: Conferir esses 2 primeiros, pois não está de acordo com protótipo os status.
    CANDIDATE,
    PLANNING,
    IN_PROGRESS,
    FINISHED
}

/** 
 * @deprecated Use ProjectReadDTO2 instead.
*/
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

export enum PortfolioProjectTableRowProjectStatus {
    IN_ANALYSIS = 'EM ANÁLISE',
    IN_PROGRESS = 'EM ANDAMENTO',
    COMPLETED = 'FINALIZADO',
    CANCELLED = 'CANCELADO'
}

export class PortfolioProjectTableRow {
    id = 0;
    name = '';
    budget = '';
    status?: PortfolioProjectTableRowProjectStatus;
    startDate = '';
    endDate = '';
    plannedValue = '';
    earnedValue = '';
}

export enum ProjectStatusEnumDTO2 {
    IN_ANALYSIS = 'IN_ANALYSIS',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class ProjectReadDTO2 {
    id = 0;
    name = '';
    description = '';
    status?: ProjectStatusEnumDTO2;
    roi = 0;
    payback = 0;
    startDate = '';
    endDate = '';
    plannedValue = 0;
    currentPlannedValue = 0;
    earnedValue = 0;
    actualCost = 0;
    percentComplete = 0;
    budget = 0;
    portfolioCategory?: PortfolioCategoryReadDTO;
    projectManager?: UserGetResponseDTO;
    createdAt?: Date;
    lastModifiedAt?: Date;
    disabled = false;
}