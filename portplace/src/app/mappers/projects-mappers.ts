import { Page } from "../models/pagination-models";

// Tipo para a linha da tabela de projetos (ajuste conforme necessário)
export interface ProjectTableRow {
    id: number;
    name: string;
    portfolio: string;
    budget: number;
    earnedValue: number;
    plannedValue: number;
    startDate: string;
    endDate: string;
    status: string;
}

// Mapeia os valores do enum ProjectStatusEnum para texto exibido na tabela
export const mapProjectStatusEnumToText = (statusEnum: any): string => {
    switch (statusEnum) {
        case "IN_ANALYSIS": return "EM ANÁLISE";
        case "CANCELLED": return "CANCELADO";
        case "IN_PROGRESS": return "EM ANDAMENTO";
        case "COMPLETED": return "FINALIZADO";
        default: return "SEM STATUS";
    }
}

// Mapeia um ProjectReadDTO para ProjectTableRow
export const mapProjectDtoToProjectTableRow = (dto: any): ProjectTableRow => {
    return {
        id: dto.id,
        name: dto.name,
        portfolio: dto.portfolio ? (dto.portfolio.name || dto.portfolio) : '',
        budget: dto.budget,
        earnedValue: dto.earnedValue,
        plannedValue: dto.plannedValue,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: mapProjectStatusEnumToText(dto.status)
    };
}

// Mapeia uma página de ProjectReadDTO para Page<ProjectTableRow>
export const mapProjectPageDtoToProjectTableRowPage = (pageDto: any): Page<ProjectTableRow> => {
    return {
        ...pageDto,
        content: pageDto.content.map((projectDTO: any) => mapProjectDtoToProjectTableRow(projectDTO))
    };
}
