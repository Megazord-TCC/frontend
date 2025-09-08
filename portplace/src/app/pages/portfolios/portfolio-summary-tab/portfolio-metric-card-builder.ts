import { firstValueFrom } from "rxjs";
import { PortfolioCostStatus, PortfolioProgressStatus, PortfolioSummaryTab } from "../../../interface/carlos-portfolio-interfaces";
import { PortfolioService } from "../../../service/portfolio-service";
import { MetricCard } from "../../../components/metric-card/metric-card.component";
import { formatToBRL } from "../../../helpers/money-helper";

//   metricCards: MetricCard[] = [
//     { title: 'Estratégia 1', subtitle: 'Estratégia ativa', color: 'purple', icon:'assets/icon/estrategia_vetor.svg' },
//     { title: 'Gabriel Martins', subtitle: 'Responsável', color: 'none', icon:'assets/icon/user_vetor.svg  ' }
//   ];

export class PortfolioMetricCardBuilder {
    cards: MetricCard[] = [];

    portfolio?: PortfolioSummaryTab;

    constructor(private portfolioService: PortfolioService) {}

    async fromGetRequestById(portfolioId: number): Promise<PortfolioMetricCardBuilder> {
        this.portfolio = await firstValueFrom(this.portfolioService.getPortfolioSummaryTabById(portfolioId));
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
        card.title = this.portfolio?.budget ?? '...';
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

    // withScheduleStatus(): PortfolioMetricCardBuilder {
    //     this.metricCards[0].title = status;
    //     this.metricCards[0].color = status === 'Dentro do prazo' ? 'green' : (status === 'No prazo' ? 'yellow' : 'red');
    //     return this;
    // }

    // withProjectStatus(status: string): PortfolioMetricCardBuilder {
    //     this.metricCards[1].title = status;
    //     this.metricCards[1].color = status === 'Ativo do planejado' ? 'green' : (status === 'Atrasado' ? 'red' : 'yellow');
    //     return this;
    // }

    // withPortfolioStatus(status: string): PortfolioMetricCardBuilder {
    //     this.metricCards[2].title = status;
    //     this.metricCards[2].color = status === 'Estratégia 1' ? 'purple' : 'none';
    //     return this;
    // }


    build(): MetricCard[] {
        return this.cards;
    }
}