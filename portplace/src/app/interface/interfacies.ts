export interface Project {
  id?: number;
  name: string;
  description: string;
  portfolio?: string | undefined;
  startDate?: string;
  endDate?: string;
  status: ProjectStatusEnum;
  projectManager?: number;
  earnedValue?: number;
  plannedValue?: number;
  actualCost?: number;
  budget?: number;
  payback?: number;
  disable?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export enum ProjectStatusEnum {
  CANDIDATE = 'CANDIDATE',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export interface Evaluation {
  id: number;
  projectId: number;
  criterionId: number;
  ahpId: number;
  score: number;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface ProjectRanking {
  projectId: number;
  name: string;
  position: number;
  totalScore: number;
}

export interface Indicator {
  id: string;
  label: string;
  value: string;
  lastUpdate: string;
}

export interface Objective {
  id: string
  name: string
  linkedCriteria: number
  activePortfolios: number
  activeProjects: number
  status: "ATIVADO" | "CANCELADO"
  statusColor: "green" | "gray"
}

export interface Objectives {
  id: string;
  name: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'email' | 'number';
  value: string;
  required: boolean;
  placeholder?: string;
  rows?: number;
  hasError?: boolean;
  errorMessage?: string;
}

export interface FormModalConfig {
  title: string;
  fields: FormField[];
  showValidationMessage?: boolean;
  validationMessage?: string;
}

export interface EvaluationGroup {
  id: number;
  name: string;
  description?: string;
  criteriaGroupId: number;
  disabled?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface EvaluationGroupView extends EvaluationGroup {
  criteriaGroup?: CriteriaGroup;
}

export interface Scenario {
  id: string
  name: string
  budget: string
  evaluation: string
  selectedProjects: number
  status: "AGUARDANDO AUTORIZAÇÃO" | "AUTORIZADO" | "CANCELADO"
  statusColor: "yellow" | "green" | "gray"
}

export interface CriteriaGroup {
  id?: number;
  name: string;
  description?: string;
  disabled: boolean;
  strategy?: Strategy;
  lastModifiedAt?: Date;
  lastModifiedBy?: User;
  createdAt?: Date;
  criteria?: Criterion[];
  criteriaComparisons?: CriteriaComparison[];
}

export interface Criterion {
  id: number;
  name: string;
  description?: string;
  criteriaGroupId: number;
  weight: number;
  disabled?: boolean;
  lastModifiedAt?: Date;
  lastModifiedBy?: User;
  createdAt?: Date;
}

export interface Strategy {
  id: number;
  name?: string;
  description?: string;
  disabled: boolean;
  createdAt?: Date;
  lastModifiedAt?: Date;
  lastModifiedBy: number;
}

export interface CriteriaComparison {
  id?: number;
  comparedCriterionId?: number;
  referenceCriterionId?: number;
  importanceScale: ImportanceScale;
  criteriaGroupId?: number;
  disabled?: boolean;
  createdAt?: Date;
  lastModifiedAt?: User;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
  projects?: Project[];
}

export enum ImportanceScale {
  EXTREMELY_MORE_IMPORTANT = 'EXTREMELY_MORE_IMPORTANT',
  MUCH_MORE_IMPORTANT = 'MUCH_MORE_IMPORTANT',
  MORE_IMPORTANT = 'MORE_IMPORTANT',
  EQUALLY_IMPORTANT = 'EQUALLY_IMPORTANT',
  LESS_IMPORTANT = 'LESS_IMPORTANT',
  MUCH_LESS_IMPORTANT = 'MUCH_LESS_IMPORTANT',
  EXTREMELY_LESS_IMPORTANT = 'EXTREMELY_LESS_IMPORTANT',
}

export const ImportanceScaleValues = {
    [ImportanceScale.EXTREMELY_MORE_IMPORTANT]: { value: 9.0, reciprocal: 1.0/9.0 },
    [ImportanceScale.MUCH_MORE_IMPORTANT]: { value: 6.0, reciprocal: 1.0/6.0 },
    [ImportanceScale.MORE_IMPORTANT]: { value: 3.0, reciprocal: 1.0/3.0 },
    [ImportanceScale.EQUALLY_IMPORTANT]: { value: 1.0, reciprocal: 1.0 },
    [ImportanceScale.LESS_IMPORTANT]: { value: 1.0/3.0, reciprocal: 3.0 },
    [ImportanceScale.MUCH_LESS_IMPORTANT]: { value: 1.0/6.0, reciprocal: 6.0 }
};

export enum RoleEnum {
    PMO = 'PMO',
    PMO_ADM = 'PMO_ADM',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    READER = 'READER'
}
