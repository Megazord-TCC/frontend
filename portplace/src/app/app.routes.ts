import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { ProjectsComponent } from './pages/projectspage/projectspage.component';
import { StrategiesPageComponent } from './pages/strategies-page/strategies-page.component';
import { ResourcesPageComponent } from './pages/resources-page/resources-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { StrategyDetailPageComponent } from './pages/strategies-page/strategy-detail-page/strategy-detail-page.component';
import { PortfolioDetailComponent } from './pages/portfolios/portfoliodetail/portfoliodetail.component';
import { ProjectDetailpageComponent } from './pages/projectspage/project-detailpage/project-detailpage.component';
import { GrupoCriteriosComponent } from './pages/grupo-criterios/grupo-criterios.component';
import { CriterioComponent } from './pages/grupo-criterios/criterio/criterio.component';
import { EvaluationGroupDetailPageComponent } from './pages/strategies-page/evaluation-group-detail-page/evaluation-group-detail-page.component';
import { ProjectEvaluationDetailComponent } from './pages/strategies-page/project-evaluation-detail/project-evaluation-detail.component';
import { ScenarioDetailPageComponent } from './pages/strategies-page/scenario-detail-page/scenario-detail-page.component';
import { ObjectiveDetailPageComponent } from './pages/strategies-page/objective-detail-page/objective-detail-page.component';
import { PageType } from './interface/carlos-auth-interfaces';
import { RoleGuard } from './guards/role-guard';
import { PortfolioEventDetailComponent } from './pages/portfolios/portfolio-event-detail/portfolio-event-detail.component';
import { PortfolioStakeholderDetailComponent } from './pages/portfolios/portfolio-stakeholder-detail/portfolio-stakeholder-detail.component';
import { PortfolioRiskDetailComponent } from './pages/portfolios/portfolio-risk-detail/portfolio-risk-detail.component';
import { ResourcesPositionDetailComponent } from './pages/resources-page/resources-position/resources-position-detail/resources-position-detail.component';
import { ResourcesDetailComponent } from './pages/resources-page/resources-pool/resources-detail/resources-detail.component';

export const routes: Routes = [

  { path: '', component: LoginComponent, canActivate: [RoleGuard], data: { pageType: PageType.LOGIN } },
  { path: 'inicio', component: HomeComponent, canActivate: [RoleGuard], data: { pageType: PageType.HOME } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { pageType: PageType.DASHBOARD } },
  { path: 'portfolios', component: PortfoliosComponent, canActivate: [RoleGuard], data: { pageType: PageType.PORTFOLIOS } },
  { path: 'portfolio/:id', component: PortfolioDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.PORTFOLIOS } },
  { path: 'portfolio/:portfolioId/evento/:eventoId', component: PortfolioEventDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.PORTFOLIOS } },
  { path: 'portfolio/:portfolioId/interessado/:interessadoId', component: PortfolioStakeholderDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.PORTFOLIOS } },
  { path: 'portfolio/:portfolioId/risco/:riscoId', component: PortfolioRiskDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.PORTFOLIOS } },
  { path: 'projetos', component: ProjectsComponent, canActivate: [RoleGuard], data: { pageType: PageType.PROJECTS } },
  { path: 'projeto/:id', component: ProjectDetailpageComponent, canActivate: [RoleGuard], data: { pageType: PageType.PROJECTS } },
  { path: 'estrategias', component: StrategiesPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'recursos', component: ResourcesPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.RESOURCES } },
  { path: 'usuarios', component: UsersPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.USERS } },
  { path: 'estrategia/:estrategiaId', component: StrategyDetailPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/objetivo/:objetivoId', component: ObjectiveDetailPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/grupo-criterio/:grupoId', component: GrupoCriteriosComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/grupo-criterio/:grupoId/criterio/:criterioId', component: CriterioComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/grupo-avaliacao/:grupoAvaliacaoId', component: EvaluationGroupDetailPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/grupo-avaliacao/:grupoAvaliacaoId/projeto/:projetoId', component: ProjectEvaluationDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'estrategia/:estrategiaId/cenario/:cenarioId', component: ScenarioDetailPageComponent, canActivate: [RoleGuard], data: { pageType: PageType.STRATEGIES } },
  { path: 'recurso/position/:id', component: ResourcesPositionDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.RESOURCES } },
  { path: 'recurso/:id', component: ResourcesDetailComponent, canActivate: [RoleGuard], data: { pageType: PageType.RESOURCES } },

  // Redireciona qualquer URL diferente dos de cima para o início
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
