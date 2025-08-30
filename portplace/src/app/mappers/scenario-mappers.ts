import { ScenariosTableRow } from "../interface/carlos-interfaces";
import { Page } from "../models/pagination-models";

// Mapeia os valores do enum ScenarioStatusEnum (definido no backend) para strings exibidas em tabelas.
export const mapScenarioStatusEnumToText = (scenarioStatusEnum: any): string => {
    switch(scenarioStatusEnum) {
        case "WAITING_AUTHORIZATION": return 'AGUARDANDO AUTORIZAÇÃO';
        case "AUTHORIZED": return 'AUTORIZADO';
        case "CANCELLED": return 'CANCELADO';
        default: return 'SEM STATUS';
    }
}

// Mapeia um objeto DTO retornado pelo backend (que representa um cenário) para o objeto exibido
// na tabela da aba de cenários da tela de estratégia específica.
export const  mapScenarioDtoToScenarioTableRow = (dto: any): ScenariosTableRow => {
    return {
        id: dto.id,
        name: dto.name,
        budget: dto.budget,
        includedProjectsQuantity: dto.scenarioRankings.length,
        status: mapScenarioStatusEnumToText(dto.status),
        evaluationGroupName: 'Backend não retornou este valor'
    };
}

// Mapeia um objeto Page DTO retornado pelo backend (que representa uma página de cenários) 
// para o objeto Page que contém uma página de ScenariosTableRow (que é o objeto exibido 
// na tabela da aba de cenários da tela de estratégia específica).
export const mapScenarioPageDtoToScenariosTableRowPage = (pageDto: any): Page<ScenariosTableRow> => {
    return {
        ...pageDto, 
        content: pageDto.content.map((scenarioDTO: any) => (mapScenarioDtoToScenarioTableRow(scenarioDTO)))
    };
}