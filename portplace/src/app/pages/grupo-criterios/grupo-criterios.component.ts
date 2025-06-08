import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../components/badge/badge.component';
import { CardComponent } from '../../components/card/card.component';
import { FormModalComponentComponent } from '../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { CriteriaComparison, CriteriaGroup, Criterion, ImportanceScale, Objective, RoleEnum, User } from '../../interface/interfacies';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-grupo-criterios',
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    BadgeComponent,
    SvgIconComponent,
    FormModalComponentComponent
  ],
  templateUrl: './grupo-criterios.component.html',
  styleUrl: './grupo-criterios.component.scss'
})
export class GrupoCriteriosComponent {

  criteriaGroups: CriteriaGroup[] = [
    {
      id: 1,
      name: "Grupo de critério 1",
      description: "Descrição do grupo 1",
      disabled: false,
      strategy: {
        id: 1,
        name: "Aumentar lucro V2",
        description: "Estratégia para aumentar lucros",
        disabled: false,
        createdAt: new Date('2023-01-01'),
        lastModifiedAt: new Date('2023-01-02'),
        lastModifiedBy: 1 // ID do usuário
      },
      criteria: [
        {
          id: 1,
          name: "Critério 1.1",
          description: "Descrição do critério 1.1",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion,
        {
          id: 2,
          name: "Critério 1.2",
          description: "Descrição do critério 1.2",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion
      ],
      criteriaComparisons: [
        {
          id: 1,
          comparedCriterion: { id: 1, name: "Critério 1.1" } as Criterion,
          referenceCriterion: { id: 2, name: "Critério 1.2" } as Criterion,
          importanceScale: ImportanceScale.MORE_IMPORTANT,
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as CriteriaComparison
      ],
      createdAt: new Date('2023-01-01'),
      lastModifiedAt: new Date('2023-01-02'),
      lastModifiedBy: { id: 1, name: "Admin", email: "admin@example.com", role: RoleEnum.PMO_ADM } as User
    },
    {
      id: 2,
      name: "Grupo de critério 2",
      description: "Descrição do grupo 2",
      disabled: false,
      strategy: {
        id: 1,
        name: "Aumentar lucro V2",
        description: "Estratégia para aumentar lucros",
        disabled: false,
        createdAt: new Date('2023-01-01'),
        lastModifiedAt: new Date('2023-01-03'),
        lastModifiedBy: 1 // ID do usuário
      },
      criteria: [
        {
          id: 3,
          name: "Critério 2.1",
          description: "Descrição do critério 2.1",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion,
        {
          id: 4,
          name: "Critério 2.2",
          description: "Descrição do critério 2.2",
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as Criterion
      ],
      criteriaComparisons: [
        {
          id: 2,
          comparedCriterion: { id: 3, name: "Critério 2.1" } as Criterion,
          referenceCriterion: { id: 4, name: "Critério 2.2" } as Criterion,
          importanceScale: ImportanceScale.EQUALLY_IMPORTANT,
          disabled: false,
          createdAt: new Date('2023-01-01'),
          lastModifiedAt: new Date('2023-01-01')
        } as CriteriaComparison
      ],
      createdAt: new Date('2023-01-01'),
      lastModifiedAt: new Date('2023-01-03'),
      lastModifiedBy: { id: 1, name: "Admin", email: "admin@example.com", role: RoleEnum.PMO_ADM } as User
    }
  ];

  estrategiaId = '';
  criteriaGroupId = '';
  showCreateModal = false;
  allObjectives: CriteriaGroup[] = []
  filteredCriteriaGroups: CriteriaGroup[] = []
  searchTerm = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.filteredCriteriaGroups = [...this.criteriaGroups];
    this.estrategiaId = this.route.snapshot.paramMap.get('estrategiaId') || '';
    this.criteriaGroupId = this.route.snapshot.paramMap.get('grupoId') || '';
  }
  goBack(): void {
    this.router.navigate([`/estrategia`, this.estrategiaId]);
  }

  getStatusLabelByDisabled(disabled: boolean): string {
    return disabled ? 'Desativado' : 'Ativado';
  }
  getStatusColorByDisabled(disabled: boolean): string {
    return disabled ? 'red' : 'green';
  }
  editCriteria() {
    console.log('Editar estratégia');
    // Lógica para edição
  }

  cancelCriteria() {
    console.log('Cancelar estratégia');
    // Lógica para cancelamento
  }

  deleteCriteria() {
    console.log('Excluir estratégia');
    // Lógica para exclusão
    // Pode adicionar um modal de confirmação aqui
  }
  openCreateModal(tab?: string): void {

    this.showCreateModal = true;

  }

   onSearchChange(): void {
    let filtered = [...this.allObjectives];
    filtered = filtered.filter(project =>
      project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCriteriaGroups = filtered;
  }
  openCriteria(criteriaId?: number): void {
    this.router.navigate([`/estrategia`, this.estrategiaId, '/grupo-criterio/', this.criteriaGroupId,'/criterio/',criteriaId]);

  }
}
