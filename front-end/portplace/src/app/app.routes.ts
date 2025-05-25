import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { ProjectsComponent } from './pages/projectspage/projectspage.component';
import { StrategiesPageComponent } from './pages/strategies-page/strategies-page.component';
import { ResourcesPageComponent } from './pages/resources-page/resources-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  //{ path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolios', component: PortfoliosComponent },
  { path: 'portfolio/:id', component: PortfoliosComponent },
  { path: 'projetos', component: ProjectsComponent },
  { path: 'estrategias', component: StrategiesPageComponent },
  { path: 'recursos', component: ResourcesPageComponent },
  { path: 'usuarios', component: UsersPageComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
