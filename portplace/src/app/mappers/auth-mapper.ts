import { Role, RoleDTO } from "../interface/carlos-auth-interfaces";

export function mapRoleToDescription(role?: Role): string {
    switch (role) {
        case Role.PMO: return 'Este cargo acessa todos recursos, mas não pode gerir usuários ou solicitar alocação de recursos.';
        case Role.PMO_ADM: return 'Este cargo acessa todos recursos, mas não pode solicitar alocação de recursos.';
        case Role.PROJECT_MANAGER: return 'Este cargo acessa somente a página de projetos e de solicitação de alocação de recursos.';
        case Role.DIRECTOR: return 'Este cargo acessa somente a dashboard.';
        default: return '';
    }
}

export function fromRoleToRoleDTO(role?: Role): RoleDTO | undefined {
    switch (role) {
        case Role.PMO: return RoleDTO.PMO;
        case Role.PMO_ADM: return RoleDTO.PMO_ADM;
        case Role.PROJECT_MANAGER: return RoleDTO.PROJECT_MANAGER;
        case Role.DIRECTOR: return RoleDTO.READER;
        default: return undefined;
    }
}

export function fromRolesDTOToRoles(role?: RoleDTO): Role | undefined {
    switch (role) {
        case RoleDTO.PMO: return Role.PMO;
        case RoleDTO.PMO_ADM: return Role.PMO_ADM;
        case RoleDTO.PROJECT_MANAGER: return Role.PROJECT_MANAGER;
        case RoleDTO.READER: return Role.DIRECTOR;
        default: return undefined;
    }
}