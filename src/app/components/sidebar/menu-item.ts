import { PageType } from "../../interface/carlos-auth-interfaces";

export class MenuItem {
    id = '';
    label = '';
    icon = '';
    route = '';
}

const inicioMenuItem = { id: 'inicio', label: 'Início', icon: 'assets/icon/home_vetor.svg', route: '/inicio' };
const dashboardMenuItem = { id: 'dashboard', label: 'Dashboard', icon: 'assets/icon/dashboard_vetor.svg', route: '/dashboard' };
const portfoliosMenuItem = { id: 'portfolios', label: 'Portfólios', icon: 'assets/icon/hub_portfolios_vetor.svg', route: '/portfolios' };
const projectsMenuItem = { id: 'projects', label: 'Projetos', icon: 'assets/icon/assignment_projetos_vetor.svg', route: '/projetos' };
const strategiesMenuItem = { id: 'strategies', label: 'Estratégias', icon: 'assets/icon/estrategia_vetor.svg', route: '/estrategias' };
const resourcesMenuItem = { id: 'resources', label: 'Recursos', icon: 'assets/icon/recursos_vetor.svg', route: '/recursos' };
const usersMenuItem = { id: 'users', label: 'Usuários', icon: 'assets/icon/usuarios_vetor.svg', route: '/usuarios' };

export function getAuthorizedMenuItems(authorizedPages: PageType[]): MenuItem[] {
    return authorizedPages
        .filter(pageType => pageType !== PageType.LOGIN)
        .map(pageType => {
            switch (pageType) {
                case PageType.HOME: return inicioMenuItem;
                case PageType.DASHBOARD: return dashboardMenuItem;
                case PageType.PORTFOLIOS: return portfoliosMenuItem;
                case PageType.PROJECTS: return projectsMenuItem;
                case PageType.STRATEGIES: return strategiesMenuItem;
                case PageType.RESOURCES: return resourcesMenuItem;
                case PageType.USERS: return usersMenuItem;
            }
        });
}