import { PositionReadDTO } from '../interface/cargos-interfaces';
import { Page } from '../models/pagination-models';


export interface ResourcesPositionTableRow {
    id: number;
    name: string;
    status?: string;
    resourcesCount?: number;
    disabled?: boolean;
    createdAt?: string;
    lastModifiedAt?: string;
    createdBy?: string;
    lastModifiedBy?: string;
}

export function mapPositionReadDTOPageToResourcesPositionTableRowPage(page: Page<PositionReadDTO>): Page<ResourcesPositionTableRow> {
    return {
        ...page,
        content: page.content.map(position => mapPositionReadDTOToResourcesPositionTableRow(position))
    };
}

export function mapPositionReadDTOToResourcesPositionTableRow(position: PositionReadDTO): ResourcesPositionTableRow {
    return {
        id: position.id,
        name: position.name,
        status: position.status,
        resourcesCount: position.resourcesCount,
        disabled: position.disabled,
        createdAt: position.createdAt,
        lastModifiedAt: position.lastModifiedAt,
        createdBy: position.createdBy,
        lastModifiedBy: position.lastModifiedBy
    };
}
