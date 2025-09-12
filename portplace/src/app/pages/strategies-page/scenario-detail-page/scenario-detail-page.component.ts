import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { debounceTime, forkJoin, map, Observable, of, Subject, Subscription, tap } from 'rxjs';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../../../service/breadcrumb.service';
import { ActionButtons, PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ScenarioService } from '../../../service/scenario-service';
import { mapScenarioRankingsPageDtoToScenarioProjectsPage, mapScenarioStatusEnumToText, mapScenarioStatusToBadgeStatusColor } from '../../../mappers/scenario-mappers';
import { EstrategiaService } from '../../../service/estrategia.service';
import { Strategy } from '../../../interface/interfacies';
import { getActionButton, getColumns, getFilterText, getPortfolioCategorySelectButtonConfigurations } from './scenario-detail-table-config';
import { TableComponent } from '../../../components/table/table.component';
import { DataRetrievalMethodForTableComponent, Page, PaginationQueryParams } from '../../../models/pagination-models';
import { ActionButton, SelectButtonOptionSelected } from '../../../components/table/table-contracts';
import { ScenarioRankingStatusEnum, ScenarioReadDTO, ScenarioStatusEnum } from '../../../interface/carlos-scenario-dtos';
import { ProjectInclusionStatusChangeHandler } from './project-inclusion-status-change-handler';
import { ScenarioEditModal } from '../../../components/scenario-edit-modal/scenario-edit-modal.component';
import { ScenarioDeleteModal } from '../../../components/scenario-delete-modal/scenario-delete-modal.component';
import { formatToBRL, handleScenarioBudgetKeyDown, parseFormatedBRLToNumber } from '../../../helpers/money-helper';
import { WarningInformationModalComponent } from '../../../components/warning-information-modal/warning-information-modal.component';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';
import { CancelScenarioModalComponent } from '../../../components/cancel-scenario-modal/cancel-scenario-modal.component';
import { ScenarioAuthorizationModalComponent } from '../../../components/scenario-authorization-modal/scenario-authorization-modal.component';
import { PortfolioService } from '../../../service/portfolio-service';
import { CategoryService } from '../../../service/category-service';
import { ProjectCategoryChangeHandler } from './project-category-change-handler';

@Component({
    selector: 'app-scenario-detail-page',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbComponent,
        PageHeaderComponent,
        TableComponent,
        ScenarioEditModal,
        ScenarioDeleteModal,
        WarningInformationModalComponent,
        TooltipComponent,
        CancelScenarioModalComponent,
        ScenarioAuthorizationModalComponent
    ],
    templateUrl: './scenario-detail-page.component.html',
    styleUrl: './scenario-detail-page.component.scss'
})
export class ScenarioDetailPageComponent {
    @ViewChild(TableComponent) tableComponent?: TableComponent;
    @ViewChild(ScenarioEditModal) editModal?: ScenarioEditModal;

    strategyId = 0;
    strategy?: Strategy;

    // Variáveis do cenário
    scenarioId = 0;
    name = '...';
    description = '...';
    statusBadge = { text: '...', color: 'blue' };
    goBackButtonPathToNavigate = '';
    lastUpdate?: Date;
    budget = '0,00';
    extraKeyValuePairInfos = [
        { key: 'Portfólio', value: '...', tooltip: 'Configura categorias e destino dos projetos após a autorização do cenário.' },
        { key: 'Grupo de avaliação', value: '...', tooltip: 'Define quais projetos serão analisados neste cenário, além do valor estratégico de cada um.' }
    ];
    scenarioDTO: ScenarioReadDTO | undefined;
    visibleActionButtons: ActionButtons[] = ['edit'];

    allProjectsBudget = '...';
    allIncludedProjectsBudget = '...';

    routeSubscription?: Subscription;

    filterText = getFilterText();
    columns = getColumns();
    actionButton: ActionButton | undefined;

    cancelAllActions = false;

    route = inject(ActivatedRoute);
    breadcrumbService = inject(BreadcrumbService);
    scenarioService = inject(ScenarioService);
    strategyService = inject(EstrategiaService);
    categoryService = inject(CategoryService);

    isScenarioEditModalVisible = false;
    isScenarioDeleteModalVisible = false;
    isScenarioCancelModalVisible = false;
    isScenarioAuthorizationModalVisible = false;
    isWarningInformationModalVisible = false;
    hasWarningInformationModalAlreadyDisplayed = false;

    private sendBudgetUpdateRequestThenRepopulateTableSubject = new Subject<void>();

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            this.setVariablesByRouteParams(params);
            this.setGoBackButtonPathToNavigate();
            this.loadScenarioByIdAndStrategyByIdAndSetupBreadcrumbs();
            this.setupBudgetUpdateSubject();
        });
    }

    ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }

    setupPageByScenarioStatus() {
        switch (this.scenarioDTO?.status) {
            case ScenarioStatusEnum.CANCELLED:
                this.visibleActionButtons = ['edit', 'delete'];
                this.cancelAllActions = true;
                this.actionButton = undefined;
                this.tableComponent?.disableAllTableSelectButtons();
                break;
            case ScenarioStatusEnum.AUTHORIZED:
                this.visibleActionButtons = ['edit'];
                this.cancelAllActions = true;
                this.actionButton = undefined;
                this.tableComponent?.disableAllTableSelectButtons();
                break;
            default:
                this.tableComponent?.enableAllTableSelectButtons();
                this.cancelAllActions = false;
                this.actionButton = getActionButton();
                this.visibleActionButtons = ['edit', 'delete', 'cancel'];
        }
    }

    loadPortfolioCategoriesOptions() {
        let portfolioId = this.scenarioDTO?.portfolio?.id;
        if (!portfolioId) return;

        this.categoryService.getAllCategoriesByPortfolioId(portfolioId).subscribe(categories => {
            let column = this.columns.find(column => column.label == 'Categoria');
            if (!column) return;

            column.selectButtonConfiguration = getPortfolioCategorySelectButtonConfigurations();
            let config = column.selectButtonConfiguration;

            categories.forEach(category =>
                config.options.push({
                    label: category.name,
                    value: category.id.toString(),
                    hidden: false
                })
            );
        });
    }

    onScenarioCancelled(): void {
        this.isScenarioCancelModalVisible = false;
        this.loadScenarioByIdAndStrategyByIdAndSetupBreadcrumbs();
    }

    getProjectInclusionStatusChangeHandler(): ProjectInclusionStatusChangeHandler {
        return new ProjectInclusionStatusChangeHandler(this.strategyId, this.scenarioId, this.scenarioService);
    }

    getProjectCategoryChangeHandler(): ProjectCategoryChangeHandler {
        return new ProjectCategoryChangeHandler(this.strategyId, this.scenarioId, this.scenarioService);
    }

    onSelectChange(optionSelected: SelectButtonOptionSelected) {
        let frontendAttributeName = optionSelected.column.frontendAttributeName;
        let httpCall$: Observable<void> | undefined = undefined;

        // Conferindo qual é o <select>, pois nesta tabela há 2 (<select> para status e outro para categoria)
        // e fazendo tratamento diferenciado com base nisso
        if (frontendAttributeName == 'inclusionStatus') {
            httpCall$ = this.getProjectInclusionStatusChangeHandler().tryChangeInclusionStatus(optionSelected);
        } else if (frontendAttributeName == 'portfolioCategoryId') {
            httpCall$ = this.getProjectCategoryChangeHandler().changeCategory(optionSelected);
        }

        // Recarrega tabela pra mostrar valores atualizados após alterações do usuário.
        httpCall$?.subscribe(_ => {
            this.tableComponent?.sendHttpGetRequestAndPopulateTable();
            this.loadScenarioByIdAndStrategyByIdAndSetupBreadcrumbs();
        });
    }

    // Usado pelo TableComponent.
    // Recarrega a tabela de projetos do cenário, buscando os dados via requisição HTTP.
    getDataForTableComponent: DataRetrievalMethodForTableComponent = (queryParams?: PaginationQueryParams): Observable<Page<any>> => (
        this.scenarioService.getScenarioProjects(this.strategyId, this.scenarioId, queryParams).pipe(
            map(page => (mapScenarioRankingsPageDtoToScenarioProjectsPage(page)))
        )
    );

    loadScenarioByIdAndStrategyByIdAndSetupBreadcrumbs() {
        // forkJoin: executa código do 'subscribe' quando TODAS as requisições terminarem.
        // Isso é importante pois o setupBreadCrumbs utiliza dados de ambas requisições.
        forkJoin([
            this.scenarioService.getScenarioById(this.strategyId, this.scenarioId),
            this.strategyService.getStrategyById(this.strategyId)
        ]).subscribe(([scenario, strategy]) => {
            this.setScenarioRelatedVariables(scenario);
            this.scenarioDTO = scenario;
            this.strategy = strategy;
            this.setupBreadcrumbs();
            this.loadPortfolioCategoriesOptions();
            this.setupPageByScenarioStatus();
        })
    }

    setScenarioRelatedVariables(scenarioDTO: any) {
        if (!scenarioDTO) return;

        this.name = scenarioDTO.name;
        this.description = scenarioDTO.description;
        this.statusBadge = {
            text: mapScenarioStatusEnumToText(scenarioDTO.status),
            color: mapScenarioStatusToBadgeStatusColor(scenarioDTO.status)
        };
        this.lastUpdate = scenarioDTO.lastModifiedAt ? new Date(scenarioDTO.lastModifiedAt) : new Date(scenarioDTO.createdAt);
        this.budget = formatToBRL(scenarioDTO.budget);

        this.allProjectsBudget = formatToBRL(this.calculateAllProjectsBudget(scenarioDTO));
        this.allIncludedProjectsBudget = formatToBRL(this.calculateAllIncludedProjectsBudget(scenarioDTO));

        let extraKeyValuePairInfos = [...this.extraKeyValuePairInfos];
        extraKeyValuePairInfos[0].value = scenarioDTO?.portfolio?.name ?? 'Erro';
        extraKeyValuePairInfos[1].value = scenarioDTO?.evaluationGroup?.name ?? 'Erro';
        this.extraKeyValuePairInfos = extraKeyValuePairInfos;
    }

    calculateAllIncludedProjectsBudget(scenarioDto: any): number {
        let scenario: ScenarioReadDTO = scenarioDto as ScenarioReadDTO;
        return scenario.scenarioRankings
            .filter(ranking =>
                ranking.status === ScenarioRankingStatusEnum.MANUALLY_INCLUDED
                || ranking.status === ScenarioRankingStatusEnum.INCLUDED
            )
            .map(ranking => ranking.project?.budgetAtCompletion ?? 0).reduce((a, b) => a + b, 0);
    }

    calculateAllProjectsBudget(scenarioDto: any): number {
        let scenario: ScenarioReadDTO = scenarioDto as ScenarioReadDTO;
        return scenario.scenarioRankings.map(ranking => ranking.project?.budgetAtCompletion ?? 0).reduce((a, b) => a + b, 0);
    }

    setVariablesByRouteParams(params: ParamMap) {
        this.scenarioId = Number(params.get('cenarioId'));
        this.strategyId = Number(params.get('estrategiaId'));
    }

    setGoBackButtonPathToNavigate() {
        this.goBackButtonPathToNavigate = `/estrategia/${this.strategyId}`;
    }

    setupBreadcrumbs() {
        this.breadcrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Estratégias', url: '/estrategias', isActive: false },
            { label: this.strategy?.name ?? '...', url: `/estrategia/${this.strategyId}`, isActive: false },
            { label: this.name, url: `/estrategia/${this.strategyId}/cenario/${this.scenarioId}`, isActive: true },
        ]);
    }

    // Configura o subject para atualizar o orçamento
    // Ele evita que múltiplas requisições sejam feitas em um curto período de tempo
    // Também atualiza a tabela de projetos do cenário
    setupBudgetUpdateSubject() {
        this.sendBudgetUpdateRequestThenRepopulateTableSubject
            .pipe(
                debounceTime(1000), // espera 500ms após o último keydown
                tap(_ => this.updateScenarioBudgetByHttpRequest().subscribe(
                    _ => this.tableComponent?.sendHttpGetRequestAndPopulateTable()
                ))
            )
            .subscribe();
    }

    updateScenarioBudgetByHttpRequest(): Observable<void> {
        // Converte para número
        const budgetNumber = parseFormatedBRLToNumber(this.budget);
        // Atualiza apenas o budget
        // TODO: Chamar o novo endpoint só de atualização de budget de cenário, quando o backend
        // o criar.
        return this.scenarioService.updateScenario(this.strategyId, this.scenarioId, {
            name: this.name,
            description: this.description,
            budget: budgetNumber,
            status: this.scenarioDTO?.status ?? ScenarioStatusEnum.WAITING_AUTHORIZATION
        });
    }

    onBudgetClick() {
        if (this.hasWarningInformationModalAlreadyDisplayed) return;

        this.isWarningInformationModalVisible = true;
    }

    onWarningInformationModalClose() {
        this.hasWarningInformationModalAlreadyDisplayed = true;
        this.isWarningInformationModalVisible = false;
    }

    onBudgetKeyDown(event: KeyboardEvent) {
        handleScenarioBudgetKeyDown(
            event,
            () => this.budget,
            v => this.budget = v
        );

        this.sendBudgetUpdateRequestThenRepopulateTableSubject.next();
    }

    openEditModal() {
        this.isScenarioEditModalVisible = true;
        this.editModal?.restartForm();
    }

    onCloseEditModal() {
        this.isScenarioEditModalVisible = false;
        this.loadScenarioByIdAndStrategyByIdAndSetupBreadcrumbs();
        this.tableComponent?.sendHttpGetRequestAndPopulateTable();
    }

}
