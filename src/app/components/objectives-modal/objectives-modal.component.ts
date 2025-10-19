import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Objective } from '../../interface/interfacies';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { StrategiaObjetivoService } from '../../service/strategia-objetivo.service';
import { mapObjectivePageDtoToObjectiveTableRowPage } from '../../mappers/objectives-mappers';

@Component({
  selector: 'objectives-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './objectives-modal.component.html',
  styleUrl: './objectives-modal.component.scss'
})
export class ObjectivesModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() linkedObjectives: Objective[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<number>();

  httpClient = inject(HttpClient);
  strategiaObjetivoService = inject(StrategiaObjetivoService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  strategyId = -1;
  inputObjectiveSelectedId = '';
  inputObjectivesOptions: Objective[] = [];
  errorMessage = '';
  isSubmitButtonDisabled = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        // Modal foi aberto: consultar lista de objetivos disponíveis
        this.loadAvailableObjectives();
        this.clearForm();
      } else {
        // Modal foi fechado: limpar estado interno
        this.clearForm();
        this.inputObjectivesOptions = [];
      }
    }

    // Se os objetivos vinculados mudaram e o modal está aberto, recarregar opções
    if (changes['linkedObjectives'] && this.isVisible) {
      this.loadAvailableObjectives();
    }
  }

  loadAvailableObjectives() {
    if (this.strategyId <= 0) {
      console.error('Strategy ID inválido:', this.strategyId);
      return;
    }

    this.strategiaObjetivoService.getObjectivesPage(this.strategyId).subscribe({
      next: (page) => {
        const mappedPage = mapObjectivePageDtoToObjectiveTableRowPage(page);

        // Filtrar objetivos que já estão vinculados
        const linkedIds = this.linkedObjectives?.map(obj => obj.id) || [];
        this.inputObjectivesOptions = mappedPage.content.filter((obj: Objective) =>
          !linkedIds.includes(obj.id)
        );

        console.log('Objetivos disponíveis:', this.inputObjectivesOptions);
        console.log('IDs vinculados:', linkedIds);

        // Verificar se há objetivos disponíveis
        if (this.inputObjectivesOptions.length === 0) {
          this.errorMessage = 'Nenhum objetivo disponível para vincular. Todos já estão vinculados ou não há objetivos cadastrados.';
          this.isSubmitButtonDisabled = true;
        } else {
          this.errorMessage = '';
          this.isSubmitButtonDisabled = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar objetivos:', error);
        this.errorMessage = 'Erro ao carregar objetivos disponíveis.';
        this.isSubmitButtonDisabled = true;
        this.inputObjectivesOptions = [];
      }
    });
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.clearForm();
    this.close.emit();
  }

  async onSave(): Promise<void> {
    if (!this.inputObjectiveSelectedId) {
      this.errorMessage = 'Selecione um objetivo para vincular.';
      return;
    }

    const objectiveId = Number(this.inputObjectiveSelectedId);

    // Limpar estado e emitir evento
    this.clearForm();
    this.saved.emit(objectiveId);
  }

  clearForm() {
    this.inputObjectiveSelectedId = '';
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
  }
}
