import { UserGetResponseDTO, UserStatus, UserStatusEnumDTO, UserTableRow } from "../interface/carlos-user-interfaces";
import { Page } from "../models/pagination-models";
import { fromRolesDTOToRoles } from "./auth-mapper";

export function mapUserStatusToUserStatusEnumDTO(status?: UserStatus): UserStatusEnumDTO | undefined {
    switch (status) {
        case UserStatus.ACTIVE: return UserStatusEnumDTO.ACTIVE;
        case UserStatus.INACTIVE: return UserStatusEnumDTO.INACTIVE;
        default: return undefined;
    }   
}

export function mapUserStatusEnumDTOToUserStatus(status?: UserStatusEnumDTO): UserStatus | undefined {
    switch (status) {
        case UserStatusEnumDTO.ACTIVE: return UserStatus.ACTIVE;
        case UserStatusEnumDTO.INACTIVE: return UserStatus.INACTIVE;
        default: return undefined;
    }   
}

export function mapUserGetResponseDTOToUserTableRow(dto: UserGetResponseDTO): UserTableRow {
    return {
        id: dto.id,
        name: dto.name,
        email: dto.email,
        role: fromRolesDTOToRoles(dto.role),
        status: mapUserStatusEnumDTOToUserStatus(dto.status)
    };
}

export function mapUserGetResponseDTOPageToUserTableRowPage(dto: Page<UserGetResponseDTO>): Page<UserTableRow> {
    return {
        ...dto,
        content: dto.content.map(mapUserGetResponseDTOToUserTableRow)
    };
}