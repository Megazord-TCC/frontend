export interface Project {
  id?: number;
  name: string;
  description: string;
  portfolio?: any;
  startDate: string;
  endDate: string;
  status: ProjectStatusEnum;
  projectManager: number;
  earnedValue: number;
  plannedValue: number;
  actualCost: number;
  budget: number;
  payback: number;
  createdAt?: string;
  lastModifiedAt?: string;
  disabled?: boolean;
  cancellationReason?: string;
}

export interface ProjectPageableResponse {
  content: Project[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export enum ProjectStatusEnum {
  IN_ANALYSIS = 'IN_ANALYSIS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
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
  displayValue?: string;
  isEditable?: boolean;
  fieldName?: string;
}

export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  lastModifiedAt: string;
  status: "ATIVADO" | "CANCELADO";
  statusColor: "green" | "gray";
}

export interface Objective {
  id: number
  strategyId: number
  disabled: boolean
  name: string
  description?: string
  createdAt: string
  lastModifiedAt: string
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
  criteriaIdList?: number[];
  status?: CriteriaGroupStatusEnum;
  lastModifiedAt?: Date;
  lastModifiedBy?: User;
  createdAt?: Date;
  criteriaCount?: number;
  criteriaComparisonCount?: number;
}

export enum CriteriaGroupStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Criterion {
  id: number;
  name: string;
  description?: string;
  criteriaGroupId: number;
  weight: number;
  disabled: boolean;
  lastModifiedAt?: Date;
  lastModifiedBy?: User;
  createdAt?: Date;
}

export interface Strategy {
  id?: number; // Opcional para criação, obrigatório para leitura
  name: string;
  description?: string;
  status?: StrategyStatusEnum;
  activeObjectivesCount?: number; // Campo do backend
  disabled?: boolean;
  createdAt?: Date;
  lastModifiedAt?: Date;

  // Campos legados para compatibilidade
  activeObjectives?: number;
  statusColor?: string;
}

export enum StrategyStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
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

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

export interface MetricCard {
  title: string;
  subtitle: string;
  color: string;
  value?: string;
  icon: string;
}

export interface Risk {
  code: number;
  name: string;
  probability: number;
  impact: number;
  severity: number;
  resolvedOccurrences: number;
  unresolvedOccurrences: number;
}

// Interfaces para tratamento de erros da API
export interface ApiError {
  status: number;
  message: string;
  path: string;
  method: string;
  timestamp: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field?: string;
  rejectedValue?: any;
  defaultMessage?: string;
  code?: string;
  objectName?: string;
}
