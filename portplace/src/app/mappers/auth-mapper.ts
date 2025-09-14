import { Role, RoleDTO } from "../interface/carlos-auth-interfaces";


export function fromRolesDTOToRoles(role?: RoleDTO): Role | undefined {
    switch (role) {
        case RoleDTO.PMO: return Role.PMO;
        case RoleDTO.PMO_ADM: return Role.PMO_ADM;
        case RoleDTO.PROJECT_MANAGER: return Role.PROJECT_MANAGER;
        case RoleDTO.READER: return Role.DIRECTOR;
        default: return undefined;
    }
}