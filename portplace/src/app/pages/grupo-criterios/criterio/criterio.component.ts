import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-criterio',
  imports: [],
  templateUrl: './criterio.component.html',
  styleUrl: './criterio.component.scss'
})
export class CriterioComponent {
   estrategiaId!: number;
  grupoId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.estrategiaId = Number(this.route.snapshot.paramMap.get('estrategiaId'));
    this.grupoId = Number(this.route.snapshot.paramMap.get('grupoId'));

    // Agora você pode usar os dois IDs para buscar os dados necessários
    // Exemplo:
    // this.service.getGrupoCriterio(this.estrategiaId, this.grupoId).subscribe(...)
  }
}
