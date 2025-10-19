import { Role, RoleDTO } from "./carlos-auth-interfaces";

export enum UserStatus {
    ACTIVE = 'Ativado',
    INACTIVE = 'Desativado'
}

export class UserTableRow {
    id = 0;
    name = '';
    email = '';
    role?: Role;
    status?: UserStatus;
}

export enum UserStatusEnumDTO {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export class UserGetResponseDTO {
    id = 0;
    name = '';
    email = '';
    role?: RoleDTO;
    status?: UserStatusEnumDTO;
}