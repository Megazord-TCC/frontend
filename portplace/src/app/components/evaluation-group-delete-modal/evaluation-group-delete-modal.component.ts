import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EvaluationGroupView } from '../../interface/carlos-interfaces';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-evaluation-group-delete-modal',
  imports: [CommonModule],
  templateUrl: './evaluation-group-delete-modal.component.html',
  styleUrl: './evaluation-group-delete-modal.component.scss'
})
export class EvaluationGroupDeleteModal {
  @Input() isVisible = false;
  @Input() evaluationGroup: EvaluationGroupView | undefined;

  @Output() close = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);

  strategyId = -1;

  errorMessage = '';
  isDeleteButtonDisabled = false;
  isDeleting = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
  }

  ngOnChanges() {
    if (this.isVisible) {
      console.log('🗑️ Modal de exclusão aberto para:', this.evaluationGroup);
      this.clearMessages();
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isDeleting) {
      this.onClose();
    }
  }

  onClose(): void {
    if (!this.isDeleting) {
      console.log('❌ Cancelando exclusão');
      this.clearMessages();
      this.close.emit();
    }
  }

  async onDelete(): Promise<void> {
    if (!this.evaluationGroup || !this.evaluationGroup.id) {
      console.log('❌ Grupo de avaliação não encontrado');
      this.errorMessage = 'Erro: grupo de avaliação não encontrado.';
      return;
    }

    console.log('🗑️ Iniciando exclusão do grupo:', this.evaluationGroup.name);

    this.isDeleteButtonDisabled = true;
    this.isDeleting = true;
    this.clearMessages();

    try {
      const evaluationGroupRoute = `${environment.apiUrl}/strategies/${this.strategyId}/evaluation-groups/${this.evaluationGroup.id}`;
      console.log('🔍 URL de exclusão:', evaluationGroupRoute);

      const deleteEvaluationGroup$ = this.httpClient.delete(evaluationGroupRoute);

      deleteEvaluationGroup$.subscribe({
        next: (response) => {
          console.log('✅ Grupo de avaliação excluído com sucesso:', response);
          this.deleted.emit();
          this.onClose();
        },
        error: (error) => {
          console.error('❌ Erro ao excluir grupo de avaliação:', error);

          // Mensagens de erro específicas baseadas no status
          if (error.status === 409) {
            this.errorMessage = 'Não é possível excluir este grupo pois existem avaliações associadas a ele.';
          } else if (error.status === 404) {
            this.errorMessage = 'Grupo de avaliação não encontrado.';
          } else if (error.status === 403) {
            this.errorMessage = 'Você não tem permissão para excluir este grupo.';
          } else {
            this.errorMessage = 'Ocorreu um erro inesperado ao excluir. Tente novamente mais tarde.';
          }

          this.isDeleteButtonDisabled = false;
          this.isDeleting = false;
        }
      });

    } catch (error) {
      console.error('❌ Erro no processo de exclusão:', error);
      this.errorMessage = 'Erro inesperado. Tente novamente mais tarde.';
      this.isDeleteButtonDisabled = false;
      this.isDeleting = false;
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.isDeleteButtonDisabled = false;
    this.isDeleting = false;
  }

  hasEvaluations(): boolean {
    // Aqui você pode adicionar lógica para verificar se o grupo tem avaliações
    // Por enquanto, assumindo que sempre pode haver avaliações
    return true;
  }

  getConfirmationMessage(): string {
    const groupName = this.evaluationGroup?.name || 'este grupo';
    return `Tem certeza que deseja excluir "${groupName}"?`;
  }

  getWarningMessage(): string {
    return 'Esta ação não pode ser desfeita e todas as avaliações associadas a este grupo serão permanentemente removidas.';
  }
}
