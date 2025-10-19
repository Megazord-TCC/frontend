import { StakeholderReadDTO } from "./carlos-portfolio-stakeholders-interfaces";

export class EventParticipantTableRow {
    id = 0;
    participantName = '';
    isResponsible: 'Sim' | 'Não' = 'Não';
}

export class EventParticipantReadDTO { 
    id = 0;
    stakeholder?: StakeholderReadDTO;
    responsible = false;
    disabled = false;
    createdAt = '';
    lastModifiedAt = '';
    createdBy = '';
    lastModifiedBy = '';
}

export class EventParticipantCreateDTO {
    stakeholderId = 0;
    eventId = 0;
    responsible = false;
}

export class EventParticipantUpdateDTO {
    stakeholderId = 0;
    responsible = false;
}