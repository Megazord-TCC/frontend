import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-evaluation-create-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-project-create-modal.component.html',
  styleUrl: './evaluation-project-create-modal.component.scss'
})
export class ProjectEvaluationCreateModal {
  @Input() isVisible = false;
  @Input() evaluationGroup: any;

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute);

  strategyId = -1;
  evaluationGroupId = -1;

  inputProjectSelectedId = '';
  inputDescription = '';
  inputProjectsOptions: any[] = [];

  errorMessage = '';
  isSubmitButtonDisabled = false;

  ngOnInit() {
    this.strategyId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    this.evaluationGroupId = Number(this.route.snapshot.paramMap.get('grupoAvaliacaoId'));
    this.restartForm();
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.restartForm();
    }
  }

  restartForm() {
    this.clearForm();
    this.setInputProjectOptions();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  async onSave(): Promise<any> {
    console.log('=== INICIANDO PROCESSO DE CRIAÇÃO DE AVALIAÇÕES ===');
    console.log('Strategy ID:', this.strategyId);
    console.log('Evaluation Group ID:', this.evaluationGroupId);
    console.log('Project Selected ID:', this.inputProjectSelectedId);
    console.log('Evaluation Group:', this.evaluationGroup);

    let isFormValid = await this.isFormValid();

    if (!isFormValid) {
      console.log('❌ Formulário inválido');
      return;
    }

    // Verificar se temos o criteriaGroupId no evaluationGroup
    if (!this.evaluationGroup?.criteriaGroupId) {
      console.log('❌ Erro: criteriaGroupId não encontrado no grupo de avaliação');
      this.errorMessage = 'Erro: grupo de critérios não encontrado no grupo de avaliação.';
      return;
    }

    console.log('📋 Criteria Group ID:', this.evaluationGroup.criteriaGroupId);

    try {
      // Buscar critérios do grupo de critérios
      const criteriaRoute = `${environment.apiUrl}/strategies/${this.strategyId}/criteria-groups/${this.evaluationGroup.criteriaGroupId}/criteria`;
      console.log('🔍 Buscando critérios na rota:', criteriaRoute);

      const getCriteria$ = this.httpClient.get<any[]>(criteriaRoute);
      const criteria = await firstValueFrom(getCriteria$);

      console.log('✅ Critérios encontrados:', criteria);
      console.log('📊 Total de critérios:', criteria.length);

      if (!criteria || criteria.length === 0) {
        console.log('❌ Nenhum critério encontrado para este grupo');
        this.errorMessage = 'Nenhum critério encontrado para este grupo de critérios.';
        return;
      }

      // Criar uma avaliação para cada critério
      console.log('🚀 Iniciando criação de avaliações...');
      const evaluationPromises = criteria.map((criterion: any, index: number) => {
        const evaluationRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/evaluations`;
        const body = {
          score: 0,
          projectId: Number(this.inputProjectSelectedId),
          criterionId: criterion.id,
          ahpId: this.evaluationGroupId
        };

        console.log(`📝 Criando avaliação ${index + 1}/${criteria.length}:`, {
          rota: evaluationRoute,
          body: body,
          criterio: criterion.name || `Critério ${criterion.id}`
        });

        return this.httpClient.post(evaluationRoute, body);
      });

      // Executar todas as requisições
      console.log('⏳ Executando todas as requisições simultaneamente...');
      forkJoin(evaluationPromises).subscribe({
        next: (results) => {
          console.log('✅ Todas as avaliações criadas com sucesso!');
          console.log('📊 Resultados:', results);
          console.log('=== PROCESSO CONCLUÍDO COM SUCESSO ===');
          this.created.emit();
          this.onClose();
        },
        error: (error) => {
          console.error('❌ Erro ao criar avaliações:', error);
          console.log('=== PROCESSO FINALIZADO COM ERRO ===');
          this.errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        }
      });

    } catch (error) {
      console.error('❌ Erro ao buscar critérios:', error);
      console.log('=== PROCESSO FINALIZADO COM ERRO ===');
      this.errorMessage = 'Erro ao buscar critérios. Tente novamente mais tarde.';
    }
  }

  clearForm() {
    this.inputProjectSelectedId = '';
    this.inputDescription = '';
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
  }

  async isFormValid(): Promise<boolean> {
    return this.isProjectSelected() && await this.isProjectNotAlreadyEvaluated();
  }

  isProjectSelected(): boolean {
    let isProjectSelected = !!this.inputProjectSelectedId.trim();

    this.errorMessage = isProjectSelected ? '' : 'Os campos marcados com * são obrigatórios.';

    return isProjectSelected;
  }

  async isProjectNotAlreadyEvaluated(): Promise<boolean> {
    let evaluationsRoute = `${environment.apiUrl}/strategies/${this.strategyId}/ahps/${this.evaluationGroupId}/evaluations`;
    let getAllEvaluations$ = this.httpClient.get<any[]>(evaluationsRoute);
    let evaluations = await firstValueFrom(getAllEvaluations$);
    let isNotAlreadyEvaluated = !evaluations.some(evaluation => evaluation.projectId == Number(this.inputProjectSelectedId));

    this.errorMessage = isNotAlreadyEvaluated ? '' : 'Este projeto já foi cadastrado para avaliação neste grupo.';

    return isNotAlreadyEvaluated;
  }

  setInputProjectOptions() {
    // Chamada direta para a API de projetos
    let projectsRoute = `${environment.apiUrl}/projects`;
    let getAllProjects$ = this.httpClient.get<any[]>(projectsRoute);

    getAllProjects$.subscribe({
      next: (projects) => {
        this.inputProjectsOptions = projects.filter(project => !project.disable);

        if (!this.inputProjectsOptions.length) {
          this.errorMessage = 'Nenhum projeto foi cadastrado. Realize seu cadastro na página de projetos.';
          this.isSubmitButtonDisabled = true;
        }
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar projetos. Tente novamente mais tarde.';
        this.isSubmitButtonDisabled = true;
      }
    });
  }
}
