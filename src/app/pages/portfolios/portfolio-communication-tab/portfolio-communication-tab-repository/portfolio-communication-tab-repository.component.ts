import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioCommunicationRepositoryEditModalComponent } from '../../../../components/portfolio-communication-repository-edit-modal/portfolio-communication-repository-edit-modal.component';
import { PortfolioService } from '../../../../service/portfolio-service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-portfolio-communication-tab-repository',
    templateUrl: './portfolio-communication-tab-repository.component.html',
    styleUrls: ['./portfolio-communication-tab-repository.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        PortfolioCommunicationRepositoryEditModalComponent
    ],
    standalone: true
})
export class PortfolioCommunicationTabRepositoryComponent {
    portfolioId = 0;

    storageMethod = '';

    showEditModal = false;

    route = inject(ActivatedRoute);
    portfolioService = inject(PortfolioService);

    ngOnInit() {
        this.portfolioId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadStorageMethodByHttpRequest();
    }

    loadStorageMethodByHttpRequest() {
        this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => {
            this.storageMethod = portfolio.communicationStorageDescription;
        });
    }
}