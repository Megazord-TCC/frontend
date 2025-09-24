
export enum CommunicationMethod {
    EMAIL = 'E-mail',
    ONLINE_MEETING = 'Reunião online',
    ON_SITE_MEETING = 'Reunião presencial'
}

export enum CommunicationMethodDTO {
    EMAIL = 'EMAIL',
    ONLINE_MEETING = 'ONLINE_MEETING',
    ON_SITE_MEETING = 'ON_SITE_MEETING'
}

export enum EventPeriodicityDTO {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
    ONE_TIME = 'ONE_TIME'
}

export enum EventPeriodicity {
    DAILY = 'Diário',
    WEEKLY = 'Semanal',
    MONTHLY = 'Mensal',
    YEARLY = 'Anual',
    ONE_TIME = 'Uma única vez',
    UNDEFINED = 'Não informado'
}

export class PortfolioEventTableRow {
    id = 0;
    name = '';
    stakeholderCount = 0;
    periodicity?: EventPeriodicity;
}

export class EventCreateDTO {
    name = '';
    description = '';
    portfolioId = 0;
}

export class EventReadDTO {
    id = 0;
    name = '';
    description = '';
    infosAndDocs = '';
    discussionTopic = '';
    reason = '';
    periodicity?: EventPeriodicityDTO;
    communicationMethods?: CommunicationMethodDTO[] = [];
    portfolioId = 0;
    participantsCount = 0;
    disabled = false;
    createdAt = '';
    lastModifiedAt = '';
    createdBy = '';
    lastModifiedBy = '';
}

export class EventUpdateDTO {
    name = '';
    description = '';
    infosAndDocs = '';
    discussionTopic = '';
    reason = '';
    periodicity?: EventPeriodicityDTO;
    communicationMethods?: CommunicationMethodDTO[] = [];
}