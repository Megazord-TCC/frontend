import { PortfolioSupervisorTableRow } from "../interface/carlos-portfolio-supervisors-interfaces";
import { UserGetResponseDTO } from "../interface/carlos-user-interfaces";
import { Page } from "../models/pagination-models";


export function mapUserGetResponseDTOToPortfolioSupervisorTableRow(dto: UserGetResponseDTO): PortfolioSupervisorTableRow {
    return {
        id: dto.id,
        name: dto.name
    };
}

export function mapUserGetResponseDTOPageToPortfolioSupervisorTableRowPage(dto: Page<UserGetResponseDTO>): Page<PortfolioSupervisorTableRow> {
    return {
        ...dto,
        content: dto.content.map(user => mapUserGetResponseDTOToPortfolioSupervisorTableRow(user))
    };
}