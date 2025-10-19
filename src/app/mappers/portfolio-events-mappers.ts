import { EventPeriodicity, EventPeriodicityDTO, EventReadDTO, PortfolioEventTableRow } from "../interface/carlos-portfolio-events-interfaces";
import { Page } from "../models/pagination-models";

export function mapEventPeriodicityToEventPeriodicityDTO(status?: EventPeriodicity): EventPeriodicityDTO | undefined {
    switch (status) {
        case EventPeriodicity.DAILY: return EventPeriodicityDTO.DAILY;
        case EventPeriodicity.WEEKLY: return EventPeriodicityDTO.WEEKLY;
        case EventPeriodicity.MONTHLY: return EventPeriodicityDTO.MONTHLY;
        case EventPeriodicity.YEARLY: return EventPeriodicityDTO.YEARLY;
        case EventPeriodicity.ONE_TIME: return EventPeriodicityDTO.ONE_TIME;
        default: return undefined;
    }   
}

export function mapEventPeriodicityDTOToEventPeriodicity(status?: EventPeriodicityDTO): EventPeriodicity {
    switch (status) {
        case EventPeriodicityDTO.DAILY: return EventPeriodicity.DAILY;
        case EventPeriodicityDTO.WEEKLY: return EventPeriodicity.WEEKLY;
        case EventPeriodicityDTO.MONTHLY: return EventPeriodicity.MONTHLY;
        case EventPeriodicityDTO.YEARLY: return EventPeriodicity.YEARLY;
        case EventPeriodicityDTO.ONE_TIME: return EventPeriodicity.ONE_TIME;
        default: return EventPeriodicity.UNDEFINED;
    }   
}

export function mapUserGetResponseDTOToPortfolioEventTableRow(dto: EventReadDTO): PortfolioEventTableRow {
    return {
        id: dto.id,
        name: dto.name,
        stakeholderCount: dto.participantsCount,
        periodicity: mapEventPeriodicityDTOToEventPeriodicity(dto.periodicity)
    };
}

export function mapEventReadDTOPageToUserTableRowPage(dto: Page<EventReadDTO>): Page<PortfolioEventTableRow> {
    return {
        ...dto,
        content: dto.content.map(mapUserGetResponseDTOToPortfolioEventTableRow)
    };
}