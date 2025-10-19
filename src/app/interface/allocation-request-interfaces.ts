// Enums
export enum AllocationRequestStatusEnum {
	IN_ANALYSIS = 'IN_ANALYSIS',
	ALLOCATED = 'ALLOCATED',
	REJECTED = 'REJECTED',
	CANCELLED = 'CANCELLED'
}

export enum PriorityEnum {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH'
}

// DTOs
export interface AllocationRequestReadDTO {
	id: number;
	startDate: string;
	endDate: string;
	status: AllocationRequestStatusEnum;
	priority: PriorityEnum;
	dailyHours: number;
	position: any;
	allocation: any;
	project: any;
	createdAt: string;
	lastModifiedAt: string;
	createdBy: string;
	lastModifiedBy: string;
	disabled: boolean;
}

export interface AllocationRequestCreateDTO {
	startDate: string;
	endDate: string;
	dailyHours: number;
	priority: PriorityEnum;
	positionId: number;
	projectId: number;
}

export interface AllocationRequestUpdateDTO {
	startDate: string;
	endDate: string;
	dailyHours: number;
	priority: string;
	positionId?: number;
}
