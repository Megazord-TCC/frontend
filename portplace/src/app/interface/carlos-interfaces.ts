
export interface EvaluationGroup {
    id: number;
    name: string;
    description: string;
    criteriaGroupId: number;
    evaluations: Evaluation[];
    disabled: number;
    createdAt: Date;
    lastModifiedAt: Date;
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
}

export interface Criteria {
    id: number;
    name: string;
    description: string;
    criteriaGroupId: number;
    disabled: boolean;
    createdAt: Date;
    lastModifiedAt: Date;
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

