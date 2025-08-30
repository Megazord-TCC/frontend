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

export const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolios', component: PortfoliosComponent },
  { path: 'portfolio/:id', component: PortfolioDetailComponent },
  { path: 'projetos', component: ProjectsComponent },
  { path: 'projeto/:id', component: ProjectDetailpageComponent },
  { path: 'estrategias', component: StrategiesPageComponent },
  { path: 'recursos', component: ResourcesPageComponent },
  { path: 'usuarios', component: UsersPageComponent },
  { path: 'estrategia/:estrategiaId', component: StrategyDetailPageComponent },
  { path: 'estrategia/:estrategiaId/grupo-criterio/:grupoId', component: GrupoCriteriosComponent },
  { path: 'estrategia/:estrategiaId/grupo-criterio/:grupoId/criterio/:criterioId', component: CriterioComponent },
  { path: 'estrategia/:estrategiaId/grupo-avaliacao/:grupoAvaliacaoId', component: EvaluationGroupDetailPageComponent },
  { path: 'estrategia/:estrategiaId/grupo-avaliacao/:grupoAvaliacaoId/projeto/:projetoId', component: ProjectEvaluationDetailComponent },
  { path: 'estrategia/:estrategiaId/cenario/:cenarioId', component: ScenarioDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
