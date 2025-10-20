import { ActionButton, BadgeConfiguration, InputFilter, SelectButtonConfiguration, TableColumn } from "../../../components/table/table-contracts";

// IMPORTANTE: A instância dos objetos foram feitos dessa maneira (utilizando "new" ao invés de
// object literal) para permitir que novos atributos possam ser adicionados nas classes de 
// configuração (ex: TableColumn) sem que quebre código antigo.

// Os nomes dos métodos estão bem genéricos pra facilitar a cópia deste arquivo para configurar
// outros componentes.

export const getActionButton = (): ActionButton => {
    let button = new ActionButton();
    button.label = 'Autorizar projetos incluídos';
    return button;
}

const getBadgeConfigurations = (): BadgeConfiguration[] => {
    let badgeConfigs: BadgeConfiguration[] = [];
    let badgeConfig: BadgeConfiguration;
    
    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'green';
    badgeConfig.triggeringValues = ['MANUALLY_INCLUDED', 'INCLUDED'];
    badgeConfigs.push(badgeConfig);

    badgeConfig = new BadgeConfiguration();
    badgeConfig.color = 'red';
    badgeConfig.triggeringValues = ['EXCLUDED', 'MANUALLY_EXCLUDED'];
    badgeConfigs.push(badgeConfig);

    return badgeConfigs;
}

export enum UserSelectedProjectScenarioStatus {
    INCLUDE = 'INCLUIR',
    REMOVE = 'REMOVER',
    RESTORE = 'RESTAURAR'
}

export const getPortfolioCategorySelectButtonConfigurations = (): SelectButtonConfiguration => {
    let config = new SelectButtonConfiguration();

    config.options = [{ label: 'Selecione', value: '', hidden: true }];

    return config;
}

const getSelectButtonConfigurations = (): SelectButtonConfiguration => {
    let config = new SelectButtonConfiguration();

    config.options = [
        { label: 'INCLUÍDO', value: 'INCLUDED', hidden: true },
        { label: 'INCLUÍDO (manual)', value: 'MANUALLY_INCLUDED', hidden: true },
        { label: 'REMOVIDO', value: 'EXCLUDED', hidden: true },
        { label: 'REMOVIDO (manual)', value: 'MANUALLY_EXCLUDED', hidden: true },
        { label: 'Incluir', value: UserSelectedProjectScenarioStatus.INCLUDE, hidden: false },
        { label: 'Remover', value: UserSelectedProjectScenarioStatus.REMOVE, hidden: false },
        // Esta última opção funciona, mas optei por não ter mais ela, pois os dois botões acima já fazem essa função.
        // { label: 'Restaurar valor inicial', value: UserSelectedProjectScenarioStatus.RESTORE, hidden: false },
    ];
    
    return config;
}

export const getColumns = (): TableColumn[] => {
    let columns: TableColumn[] = [];
    let column: TableColumn;

    column = new TableColumn();
    column.label = 'Ordem atual';
    column.order = 1;
    column.isSortable = true;
    column.frontendAttributeName = 'currentOrder';
    column.backendAttributeName = 'currentPosition';
    column.tooltip = 'Prioridade dos projetos considerando as alterações que o usuário possa ter realizado na coluna "Inclusão".';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Ordem inicial';
    column.order = 2;
    column.isSortable = true;
    column.frontendAttributeName = 'initialOrder';
    column.backendAttributeName = 'calculatedPosition';
    column.tooltip = 'Prioridade inicial dos projetos, NÃO considerando as alterações que o usuário possa ter realizado na coluna "Inclusão".';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Projeto';
    column.order = 3;
    column.frontendAttributeName = 'projectName';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Inclusão';
    column.order = 4;
    column.isSortable = true;
    column.frontendAttributeName = 'inclusionStatus';
    column.backendAttributeName = 'status';
    column.selectButtonConfiguration = getSelectButtonConfigurations();
    column.badgeConfiguration = getBadgeConfigurations();
    column.required = true;
    column.tooltip = 'Define se o projeto deverá ser incluído ou removido do portfólio. É obrigatório incluir pelo menos um.';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Valor estratégico';
    column.order = 5;
    column.isSortable = true;
    column.frontendAttributeName = 'strategicValue';
    column.backendAttributeName = 'totalScore';
    column.tooltip = 'Pontuação do projeto no cenário de avaliação, através da análise AHP.';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Categoria';
    column.order = 6;
    column.frontendAttributeName = 'portfolioCategoryId';
    column.backendAttributeName = 'portfolioCategoryId';
    column.required = true;
    column.tooltip = 'Define a categoria do projeto, para fins de balanceamento. É obrigatório selecionar a categoria dos projetos incluídos.';

    // Obs: as <options> do <select> são carregadas após a requisição de categorias, no <ngOnInit>.
    column.selectButtonConfiguration = getPortfolioCategorySelectButtonConfigurations();
    columns.push(column);

    column = new TableColumn();
    column.label = 'Orçamento planejado (R$)';
    column.order = 7;
    // column.isSortable = true; // Comentado pois backend não permite ordenação por este campo
    column.frontendAttributeName = 'estimatedCost';
    // column.backendAttributeName = 'budgetAtCompletion';
    column.tooltip = 'Valor do indicador EAC do projeto. Se for indefinido, é exibido o BAC.';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Duração estimada';
    column.order = 8;
    column.frontendAttributeName = 'durationMonths';
    column.tooltip = 'Considera o início e fim planejado do projeto.';
    columns.push(column);

    column = new TableColumn();
    column.label = 'Status';
    column.order = 9;
    column.frontendAttributeName = 'projectStatus';
    columns.push(column);

    return columns;
}; 

export const getFilterText = (): InputFilter => {
    let input = new InputFilter();
    input.label = 'Buscar pelo nome do projeto';
    input.queryParam = { name: 'searchQuery', value: '' };
    return input;
}; 