import { ProjectReadDTO } from "./carlos-project-dtos";

export enum ScenarioRankingStatusEnum {
    INCLUDED,
    MANUALLY_INCLUDED,
    MANUALLY_EXCLUDED,
    EXCLUDED
}

export interface ScenarioRankingReadDTO {
    id: number;
    calculatedPosition: number;
    totalScore: number;
    status: ScenarioRankingStatusEnum;
    project: ProjectReadDTO;
    disabled: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
}

export enum ScenarioStatusEnum {
    WAITING_AUTHORIZATION,
    AUTHORIZED,
    CANCELLED,
}

export interface ScenarioReadDTO {
    id: number;
    name: string
    description: string
    budget: number;
    status: ScenarioStatusEnum;
    disabled: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
    strategyId: number;
    evaluationGroupId: number;
    scenarioRankings: ScenarioRankingReadDTO[];
}