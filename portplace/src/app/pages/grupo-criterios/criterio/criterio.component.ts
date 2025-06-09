import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CriterioService } from '../../../service/criterio.service';
import { Criterion } from '../../../interface/interfacies';

@Component({
  selector: 'app-criterio',
  imports: [],
  templateUrl: './criterio.component.html',
  styleUrl: './criterio.component.scss'
})
export class CriterioComponent {
  estrategiaId!: number;
  criteriaGroupId!: number;
  loadingProjects = false;


  criteria?: Criterion;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private criterioService: CriterioService
  ) {}

  ngOnInit(): void {
    const estrategiaIdParam = this.route.snapshot.paramMap.get('estrategiaId');
    this.estrategiaId = estrategiaIdParam ? Number(estrategiaIdParam) : 0;
    const grupoIdParam = this.route.snapshot.paramMap.get('grupoId');
    this.criteriaGroupId = grupoIdParam ? Number(grupoIdParam) : 0;
    this.loadCriteria();
    // Agora você pode usar os dois IDs para buscar os dados necessários
    // Exemplo:
    // this.service.getGrupoCriterio(this.estrategiaId, this.grupoId).subscribe(...)
  }
  async loadCriteria(): Promise<void> {
    this.loadingProjects = true;
    try {
      const criteriaGroup = await firstValueFrom(this.criterioService.getCriterioById(this.criteriaGroupId,this.estrategiaId));
      this.criteria = criteriaGroup;
      this.loadingProjects = false;
      console.log('Critérios:', criteriaGroup);
    } catch (err) {
      console.error('Erro ao buscar grupo de criterios:', err);
      this.loadingProjects = false;
    }
  }
}
