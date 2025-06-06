export interface Project {
  id?: number;
  name: string;
  description: string;
  portfolio?:string | undefined; // ou number se preferir trabalhar com IDs
  startDate?: string; // ou Date se preferir trabalhar com objetos Date
  endDate?: string;   // ou Date se preferir trabalhar com objetos Date
  status: ProjectStatusEnum;
  projectManager?: number;
  earnedValue?: number;
  plannedValue?: number;
  actualCost?: number;
  budget?: number;
  payback?: number;
}

export enum ProjectStatusEnum {
  CANDIDATE = 'CANDIDATE',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export interface Evaluation {
  id: string;
  name: string;
  weight: number;
  value: number;
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
  rows?: number; // Para textarea
  hasError?: boolean;
  errorMessage?: string;
}

export interface FormModalConfig {
  title: string;
  fields: FormField[];
  showValidationMessage?: boolean;
  validationMessage?: string;
}
export interface CriteriaGroup {
  id: string
  name: string
  criteriaGroup: string
}

export interface EvaluationGroup {
  id: string
  name: string
  criteriaGroup: string
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
