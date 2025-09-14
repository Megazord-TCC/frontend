import { PageType } from "../../interface/carlos-auth-interfaces";

export class NavigationCard {
    id = '';
    title = '';
    description = '';
    icon = '';
    route = '';
    color = '';
}

const dashboardCard: NavigationCard = {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Monitore portfólios em andamento com controle de práticos',
    icon: 'assets/icon/dashboard_vetor.svg',
    route: '/dashboard',
    color: '#3b82f6'
};

const portfoliosCard: NavigationCard = {
    id: 'portfolios',
    title: 'Portfólios',
    description: 'Gerencie e cadastre seus portfólios, seus riscos, comunicações e responsáveis',
    icon: 'assets/icon/hub_portfolios_vetor.svg',
    route: '/portfolios',
    color: '#8b5cf6'
};

const projectsCard: NavigationCard = {
    id: 'projects',
    title: 'Projetos',
    description: 'Gerencie e cadastre seus projetos',
    icon: 'assets/icon/assignment_projetos_vetor.svg',
    route: '/projetos',
    color: '#10b981'
};

const strategiesCard: NavigationCard = {
    id: 'strategies',
    title: 'Estratégias',
    description: 'Gerencie e cadastre as estratégias para avaliar projetos e os vínculos a portfólios',
    icon: 'assets/icon/estrategia_vetor.svg',
    route: '/estrategias',
    color: '#f59e0b'
};

const resourcesCard: NavigationCard = {
    id: 'resources',
    title: 'Recursos',
    description: 'Gerencie cargos, pessoas e alocações de recursos humanos',
    icon: 'assets/icon/recursos_vetor.svg',
    route: '/recursos',
    color: '#ef4444'
};

const usersCard: NavigationCard = {
    id: 'users',
    title: 'Usuários',
    description: 'Gerencie o cadastro dos usuários do sistema',
    icon: 'assets/icon/usuarios_vetor.svg',
    route: '/usuarios',
    color: '#6b7280'
};

export function getAuthorizedNavigationCards(authorizedPages: PageType[]): NavigationCard[] {
    return authorizedPages
        .filter(pageType => pageType != PageType.HOME)
        .filter(pageType => pageType != PageType.LOGIN)
        .map(pageType => {
            switch (pageType) {
                case PageType.DASHBOARD: return dashboardCard;
                case PageType.PORTFOLIOS: return portfoliosCard;
                case PageType.PROJECTS: return projectsCard;
                case PageType.STRATEGIES: return strategiesCard;
                case PageType.RESOURCES: return resourcesCard;
                case PageType.USERS: return usersCard;
            }
        });
}