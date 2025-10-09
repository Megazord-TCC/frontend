// Interfaces baseadas nos DTOs Java
import { ProjectReadDTO } from './carlos-project-dtos';
import { ResourceReadDTO } from './resources-interface';

export interface AllocationReadDTO {
  id: number;
  startDate: string; // formato dd/MM/yyyy
  endDate: string;   // formato dd/MM/yyyy
  dailyHours: number;
  allocationRequestId: number;
  resource: ResourceReadDTO;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string; // formato dd/MM/yyyy HH:mm:ss
  lastModifiedAt: string; // formato dd/MM/yyyy HH:mm:ss
}

export interface AllocationCreateDTO {
  startDate: string; // formato dd/MM/yyyy
  endDate: string;   // formato dd/MM/yyyy
  dailyHours: number;
  resourceId: number;
  allocationRequestId?: number;
}

export interface AllocationUpdateDTO {
  startDate: string; // formato dd/MM/yyyy
  endDate: string;   // formato dd/MM/yyyy
  dailyHours: number;
  resourceId: number;
}

export interface AllocationInfoDTO {
  project: ProjectReadDTO;
  resource: ResourceReadDTO;
  dailyHours: number;
}

export interface DailyAllocationDTO {
  date: string; // formato dd/MM/yyyy
  allocations: AllocationInfoDTO[];
}
