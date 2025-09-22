import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioCommunicationTabPlanComponent } from './portfolio-communication-tab-plan/portfolio-communication-tab-plan.component';
import { PortfolioCommunicationTabRepositoryComponent } from './portfolio-communication-tab-repository/portfolio-communication-tab-repository.component';

type Tab = 'plan' | 'stakeholders' | 'repository';

@Component({
    selector: 'app-portfolio-communication-tab',
    templateUrl: './portfolio-communication-tab.component.html',
    styleUrls: ['./portfolio-communication-tab.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        PortfolioCommunicationTabPlanComponent,
        PortfolioCommunicationTabRepositoryComponent
    ],
    standalone: true
})
export class PortfolioCommunicationTabComponent { 
    activeTab: Tab = 'plan';
}