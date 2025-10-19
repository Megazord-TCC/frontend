import { firstValueFrom, map } from "rxjs";
import { PortfolioCostStatus, PortfolioProgressStatus, PortfolioSummaryTab } from "../../../interface/carlos-portfolio-interfaces";
import { PortfolioService } from "../../../service/portfolio-service";
import { MetricCard } from "../../../components/metric-card/metric-card.component";
import { mapPortfolioReadDTOToPortfolioSummaryTab } from "../../../mappers/portfolio-mapper";

export class PortfolioMetricCardBuilder {
    cards: MetricCard[] = [];

    portfolio?: PortfolioSummaryTab;

    constructor(private portfolioService: PortfolioService) {}

    async fromGetRequestById(portfolioId: number): Promise<PortfolioMetricCardBuilder> {
        let portfolioById$ = this.portfolioService.getPortfolioById(portfolioId)
            .pipe(map(portfolio => mapPortfolioReadDTOToPortfolioSummaryTab(portfolio)));

        this.portfolio = await firstValueFrom(portfolioById$);
        return this;
    }

    withResponsibleUserNames(): PortfolioMetricCardBuilder {
        let cards = this.portfolio?.responsibleUserNames.map(name => {
            let card = new MetricCard();
            card.title = name;
            card.subtitle = 'Responsável';
            card.iconPath = 'assets/icon/user_vetor.svg';
            return card;
        }) ?? [];
        this.cards.push(...cards);
        return this;
    }

    withStrategyName(): PortfolioMetricCardBuilder {
        let card = new MetricCard();
        card.title = this.portfolio?.strategyName ?? '...';
        card.subtitle = 'Estratégia';
        card.iconPath = 'assets/icon/estrategia_vetor.svg';
        this.cards.push(card);
        return this;
    }

    withCostStatus(): PortfolioMetricCardBuilder {
        let card = new MetricCard();
        card.title = this.portfolio?.costStatus ?? '...';
        card.subtitle = 'Status custo';
        card.iconPath = 'assets/icon/paid_vetor.svg';
        card.color = this.portfolio?.costStatus == PortfolioCostStatus.WITHIN_BUDGET ? 'green' : 'red';
        this.cards.push(card);
        return this;
    }

    withBudget(): PortfolioMetricCardBuilder {
        let card = new MetricCard();
        card.title = `R$ ${this.portfolio?.budget ?? '0,00'}`;
        card.subtitle = 'Orçamento';
        card.iconPath = 'assets/icon/porco_vetor.svg';
        this.cards.push(card);
        return this;
    }

    withProgressStatus(): PortfolioMetricCardBuilder {
        let card = new MetricCard();
        card.title = this.portfolio?.progressStatus ?? '...';
        card.subtitle = 'Status progresso';
        card.iconPath = 'assets/icon/calendario_vetor.svg';
        card.color = this.portfolio?.progressStatus == PortfolioProgressStatus.ON_TRACK ? 'green' : 'red';
        this.cards.push(card);
        return this;
    }

    build(): MetricCard[] {
        return this.cards;
    }
}