import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin } from 'rxjs';
import { Project } from '../../interface/carlos-interfaces'; // IMPORTA A INTERFACE CORRETA

interface CriterionEvaluation {
  id: number;
  name: string;
  description: string;
  weight: number;
  score: number;
  evaluationId?: number;
}

@Component({
  selector: 'app-project-criteria-evaluation-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-criteria-evaluation-modal.component.html',
  styleUrl: './project-criteria-evaluation-modal.component.scss'
})
export class ProjectCriteriaEvaluationModal {
  @Input() isVisible = false;
  @Input() project: Project | undefined; // USA A INTERFACE GLOBAL
  @Input() criteriaEvaluations: CriterionEvaluation[] = [];
  @Input() strategyId = -1;
  @Input() evaluationGroupId = -1;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  httpClient = inject(HttpClient);

  // Formulário com cópias dos dados para edição
  evaluationForm: { [criterionId: number]: number } = {};

  errorMessage = '';
  isSubmitButtonDisabled = false;

  ngOnChanges() {
    if (this.isVisible && this.criteriaEvaluations.length > 0) {
      console.log('🎯 Modal aberto com critérios:', this.criteriaEvaluations);
      this.initializeForm();
    }
  }

  initializeForm(): void {
    console.log('📝 Inicializando formulário...');
    this.evaluationForm = {};
    this.criteriaEvaluations.forEach(criterion => {
      this.evaluationForm[criterion.id] = criterion.score;
    });
    console.log('✅ Formulário inicializado:', this.evaluationForm);
    this.clearErrors();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    console.log('❌ Fechando modal de avaliação');
    this.close.emit();
  }

  async onSave(): Promise<void> {
    console.log('💾 Salvando avaliações...');
    console.log('📊 Dados do formulário:', this.evaluationForm);

    // VALIDAÇÃO ADICIONAL PARA PROJECT
    if (!this.project || !this.project.id) {
      console.log('❌ Projeto não encontrado ou sem ID');
      this.errorMessage = 'Erro: projeto não encontrado.';
      return;
    }

    if (!this.isFormValid()) {
      console.log('❌ Formulário inválido');
      return;
    }

    this.isSubmitButtonDisabled = true;

    try {
      // Criar array de promises para atualizar cada avaliação
      const updatePromises = this.criteriaEvaluations.map(criterion => {
        const newScore = Number(this.evaluationForm[criterion.id]); // GARANTIR QUE É NUMBER

        if (criterion.evaluationId) {
          // Atualizar avaliação existente
          const updateRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/evaluations/${criterion.evaluationId}`;
          const body = {
            score: newScore,
            projectId: this.project!.id, // USAR ! DEPOIS DA VALIDAÇÃO
            criterionId: criterion.id,
            ahpId: this.evaluationGroupId
          };

          console.log(`🔄 Atualizando avaliação existente para critério ${criterion.name}:`, {
            rota: updateRoute,
            body: body
          });

          return this.httpClient.put(updateRoute, body);
        } else {
          // Criar nova avaliação
          const createRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/evaluations`;
          const body = {
            score: newScore,
            projectId: this.project!.id, // USAR ! DEPOIS DA VALIDAÇÃO
            criterionId: criterion.id,
            ahpId: this.evaluationGroupId
          };

          console.log(`➕ Criando nova avaliação para critério ${criterion.name}:`, {
            rota: createRoute,
            body: body
          });

          return this.httpClient.post(createRoute, body);
        }
      });

      // Executar todas as atualizações
      forkJoin(updatePromises).subscribe({
        next: (results) => {
          console.log('✅ Todas as avaliações foram salvas com sucesso!');
          console.log('📊 Resultados:', results);
          this.updated.emit();
          this.onClose();
        },
        error: (error) => {
          console.error('❌ Erro ao salvar avaliações:', error);
          this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
          this.isSubmitButtonDisabled = false;
        }
      });

    } catch (error) {
      console.error('❌ Erro no processo de salvamento:', error);
      this.errorMessage = 'Erro ao processar avaliações. Tente novamente mais tarde.';
      this.isSubmitButtonDisabled = false;
    }
  }

  isFormValid(): boolean {
    console.log('🔍 Validando formulário...');

    // Verificar se todos os campos estão preenchidos
    const allFieldsFilled = this.criteriaEvaluations.every(criterion => {
      const score = this.evaluationForm[criterion.id];
      return score !== undefined && score !== null && !isNaN(Number(score));
    });

    if (!allFieldsFilled) {
      this.errorMessage = 'Os campos marcados com * são obrigatórios.';
      console.log('❌ Nem todos os campos estão preenchidos');
      return false;
    }

    // Verificar se todas as notas estão no range válido (0 a 1000)
    const allScoresValid = this.criteriaEvaluations.every(criterion => {
      const score = Number(this.evaluationForm[criterion.id]);
      return score >= 0 && score <= 1000;
    });

    if (!allScoresValid) {
      this.errorMessage = 'Todas as notas devem estar entre 0 e 1000.';
      console.log('❌ Algumas notas estão fora do range válido');
      return false;
    }

    console.log('✅ Formulário válido');
    this.clearErrors();
    return true;
  }

  clearErrors(): void {
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
  }

  onScoreChange(criterionId: number): void {
    // Limpar erros quando o usuário começar a digitar
    if (this.errorMessage) {
      this.clearErrors();
    }

    // Garantir que o valor está dentro do range
    const value = this.evaluationForm[criterionId];
    if (value < 0) {
      this.evaluationForm[criterionId] = 0;
    } else if (value > 1000) {
      this.evaluationForm[criterionId] = 1000;
    }
  }
}
