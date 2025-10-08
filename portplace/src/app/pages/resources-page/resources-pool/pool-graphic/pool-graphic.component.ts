import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pool-graphic',
  imports: [],
  templateUrl: './pool-graphic.component.html',
  styleUrl: './pool-graphic.component.scss'
})
export class PoolGraphicComponent {
  @Input() selectedResource: string = '';
  @Input() selectedProject: string = '';
  @Input() startDate: string = '';
  @Input() endDate: string = '';

  ngOnChanges(): void {
    // Atualizar gráfico quando os filtros mudarem
  }
}
