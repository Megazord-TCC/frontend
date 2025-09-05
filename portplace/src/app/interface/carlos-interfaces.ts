export interface Portfolio {
    id: number;
    name: string;
}

export enum ScenarioStatus {
    AWAITING_AUTHORIZATION,
    AUTHORIZED,
    CANCELED
}

// Dados resumidos de cada cenário exibido na tabela da aba "Cenários" 
// (esta aba está presenta na página duma estratégia específica)
export interface ScenariosTableRow {
    id: number;
    name: string;
    budget: string;
    includedProjectsQuantity: number;
    status: string;
    evaluationGroupName: string;
}

export enum ProjectInclusionStatus {
    INCLUDED,
    MANUALLY_INCLUDED,
    REMOVED,
    MANUALLY_REMOVED
}

export enum ProjectStatus {
    IN_ANALYSIS,
    IN_PROGRESS,
    COMPLETED,
    CANCELED,
}

export interface ScenarioProjectRow {
    scenarioRankingId: number;
    currentOrder: number;
    initialOrder: number;
    projectId: number;
    projectName: string;
    inclusionStatus: ProjectInclusionStatus;
    strategicValue: number;
    estimatedCost: number;
    categoryId: number;
    estimatedDurationMonths: number;
    projectStatus: ProjectStatus
}


export interface ScenarioProject {
    scenarioRankingId: number;
    currentOrder: number; // Backend: calculatedPosition
    initialOrder: number;
    projectName: string;
    inclusionStatus: string; // Backend: status
    strategicValue: number; // Backend: totalScore
    estimatedCost: string; // Backend: budget
    portfolioCategoryId: string; // Backend: category (backend não implementado)
    durationMonths: string;
    projectStatus: string;
}

export interface Scenario {
    id: number;
    name: string;
    description: string;
    userDefinedBudget: number;
    status: ScenarioStatus;
    budget?: number;
    projects: ScenarioProject[];
    lastModifiedAt: Date;

    portfolioId: number;
    portfolioName?: string;

    evaluationGroupId: number;
    evaluationGroupName?: string;
}

export interface EvaluationGroup {
    id: number;
    name: string;
    description: string;
    criteriaGroupId: number;
    evaluations?: Evaluation[];
    disabled: number;
    createdAt?: Date;
    lastModifiedAt?: Date;
}

export interface CriteriaGroup {
    id: number;
    name: string;
    description: string;
    criteriaList: Criteria[];
    criteriaComparisons: CriteriaComparison[];
    lastModifiedAt: Date;
    createdAt: Date;
    disabled: boolean;
    criteriaCount: number,
    criteriaComparisonCount: number,
}

export interface Criteria {
    id: number;
    name: string;
    description: string;
    criteriaGroupId: number;
    disabled: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
    weight: number;
}

export interface CriteriaComparison {
    id: number;
    comparedCriterionId: number;
    referenceCriterionId: number;
    importanceScale: ImportanceScale;
    criteriaGroupId: number;
    disabled: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
}

export enum ImportanceScale {
    EXTREMELY_MORE_IMPORTANT = 'EXTREMELY_MORE_IMPORTANT',
    MUCH_MORE_IMPORTANT = 'MUCH_MORE_IMPORTANT',
    MORE_IMPORTANT = 'MORE_IMPORTANT',
    EQUALLY_IMPORTANT = 'EQUALLY_IMPORTANT',
    LESS_IMPORTANT = 'LESS_IMPORTANT',
    MUCH_LESS_IMPORTANT = 'MUCH_LESS_IMPORTANT'
}

export const ImportanceScaleValues: Record<ImportanceScale, { value: number, reciprocal: number }> = {
  [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: { value: 9.0, reciprocal: 1 / 9.0 },
  [ImportanceScale.MUCH_MORE_IMPORTANT]: { value: 6.0, reciprocal: 1 / 6.0 },
  [ImportanceScale.MORE_IMPORTANT]: { value: 3.0, reciprocal: 1 / 3.0 },
  [ImportanceScale.EQUALLY_IMPORTANT]: { value: 1.0, reciprocal: 1.0 },
  [ImportanceScale.LESS_IMPORTANT]: { value: 1 / 3.0, reciprocal: 3.0 },
  [ImportanceScale.MUCH_LESS_IMPORTANT]: { value: 1 / 6.0, reciprocal: 6.0 }
};

export interface EvaluationGroupView extends EvaluationGroup {
  criteriaGroup: CriteriaGroup | undefined
}

export interface Evaluation {
    id: string;
    score: number;
    projectId: number;
    criterionId: number;
    ahpId: number;
    lastModifiedAt: Date;
    createdAt: Date;
    disabled: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface ProjectRanking {
    projectId: number;
    name: string;
    position: number;
    totalScore: number;
}

export interface Project {
  id?: number;
  name: string;
  description?: string;
  status?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProjectEvaluation {
  id?: number;
  projectId: number;
  evaluationGroupId: number;
  project?: Project;
  scores?: CriteriaScore[];
  totalScore?: number;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface CriteriaScore {
  id?: number;
  criteriaId: number;
  score: number;
  criteria?: Criteria;
}

