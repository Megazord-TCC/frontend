
export enum Role {
    PMO = 'PMO',
    PMO_ADM = 'PMO Administrador',
    PROJECT_MANAGER = 'Gerente de Projeto',
    DIRECTOR = 'Diretor'
}

export enum RoleDTO {
    PMO = 'PMO',
    PMO_ADM = 'PMO_ADM',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    READER = 'READER'
}

export class AuthenticationResponseDTO {
    token = '';
}

export class TokenPayload {
  role?: RoleDTO;
  name = '';
  email = '';
  sub = '';
  iat = 0;
  exp = 0;
}

export enum PageType {
    LOGIN = 'Login',
    HOME = 'Início',
    DASHBOARD = 'Dashboard',
    PORTFOLIOS = 'Portfólios',
    PROJECTS = 'Projetos',
    STRATEGIES = 'Estratégias',
    RESOURCES = 'Recursos',
    USERS = 'Usuários'
}