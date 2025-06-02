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
import { StrategyDetailPageComponent } from './pages/strategy-detail-page/strategy-detail-page.component';
import { PortfolioDetailComponent } from './pages/portfolios/portfoliodetail/portfoliodetail.component';
import { ProjectDetailpageComponent } from './pages/projectspage/project-detailpage/project-detailpage.component';

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
  { path: 'estrategias/:id', component: StrategyDetailPageComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
