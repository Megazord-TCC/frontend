import { ProjectReadDTO } from "./carlos-project-dtos";
import { EvaluationGroup } from "./interfacies";

export class ScenarioUpdateDTO {
    name = '';
    description = '';
    budget = 0;
    status = ScenarioStatusEnum.WAITING_AUTHORIZATION;
}

export enum ScenarioRankingStatusEnum {
    INCLUDED = 'INCLUDED',
    MANUALLY_INCLUDED = 'MANUALLY_INCLUDED',
    MANUALLY_EXCLUDED = 'MANUALLY_EXCLUDED',
    EXCLUDED = 'EXCLUDED'
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
    WAITING_AUTHORIZATION = 'WAITING_AUTHORIZATION',
    AUTHORIZED = 'AUTHORIZED',
    CANCELLED = 'CANCELLED',
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
    evaluationGroup: EvaluationGroup;
    scenarioRankings: ScenarioRankingReadDTO[];
}