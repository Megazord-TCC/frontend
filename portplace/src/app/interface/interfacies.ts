export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatusEnum;
  portfolio: string;
  budget: string;
  ev: string;
  pv: string;
  startDate: string;
  endDate: string;
  statusColor: 'yellow' | 'blue' | 'green' | 'gray';
}

export enum ProjectStatusEnum{
  CANDIDATE,
  PLANNING,
  IN_PROGRESS,
  FINISHED
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
  id: string;
  name: string;
}
