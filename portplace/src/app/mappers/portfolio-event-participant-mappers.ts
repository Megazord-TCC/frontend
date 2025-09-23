import { EventParticipantReadDTO, EventParticipantTableRow } from "../interface/carlos-portfolio-event-participant-interfaces";
import { Page } from "../models/pagination-models";

export function mapEventParticipantReadDTOToEventParticipantTableRow(dto: EventParticipantReadDTO): EventParticipantTableRow {
    return {
        id: dto.id,
        participantName: dto.stakeholder?.name ?? 'Erro',
        isResponsible: dto.responsible ? 'Sim' : 'Não'
    };
}

export function mapEventParticipantReadDTOPageToEventParticipantTableRowPage(dto: Page<EventParticipantReadDTO>): Page<EventParticipantTableRow> {
    return {
        ...dto,
        content: dto.content.map(participant => mapEventParticipantReadDTOToEventParticipantTableRow(participant))
    };
}