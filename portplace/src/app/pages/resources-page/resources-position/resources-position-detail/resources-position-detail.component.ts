import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { FormModalConfig } from '../../../../interface/interfacies';
import { PositionReadDTO } from '../../../../interface/cargos-interfaces';
import { CargosService } from '../../../../service/cargos.service';
import { retry } from 'rxjs';
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-resources-position-detail',
  imports: [
    SvgIconComponent,
    BadgeComponent,
    BreadcrumbComponent
  ],
  templateUrl: './resources-position-detail.component.html',
  styleUrl: './resources-position-detail.component.scss'
})
export class ResourcesPositionDetailComponent {
  editPortfolioConfig: FormModalConfig = {
      title: 'Editar portfólio',
      fields: [
        {
          id: 'name',
          label: 'Nome',
          type: 'text',
          value: '',
          required: true,
          placeholder: 'Digite o nome do portfólio'
        }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
  };
  showEditModal: boolean = false;
  showCancelModal: boolean = false;
  position: PositionReadDTO | null = null;
  router = inject(Router);
  cargoService = inject(CargosService);
  breadCrumbService = inject(BreadcrumbService); // Supondo que você tenha um serviço de breadcrumb
  loadPositionDetails(positionId: number): void {
    this.cargoService.getPositionById(positionId)
      .pipe(retry(5))
      .subscribe({
        next: (positionDto) => {


          console.log('Detalhes da posição:', positionDto);
          this.position = positionDto;
          this.breadCrumbService.addChildBreadcrumb({
            label: `Recurso: ${this.position.name}`,
            url: `/recursos/${this.position.id}`,
            isActive: true
          });
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do projeto:', err);
          this.router.navigate(['/projects']);
        }
      });
  }
  getPositionStatusEnumToText = (statusEnum: any): string => {
      switch (statusEnum) {
          case "IN_ANALYSIS": return "EM ANÁLISE";
          case "CANCELLED": return "CANCELADO";
          case "IN_PROGRESS": return "EM ANDAMENTO";
          case "COMPLETED": return "FINALIZADO";
          default: return "SEM STATUS";
      }
  }

  getPositionStatusColor(status: any): string {
    switch (status) {
      case 'IN_ANALYSIS':
        return 'yellow';
      case 'IN_PROGRESS':
        return 'green';
      case 'COMPLETED':
        return 'blue';
      case 'CANCELLED':
        return 'gray';
      default:
        return 'gray';
    }
  }
  goBack(): void {
    this.router.navigate(['/recursos']);
  }
  openEditModal(): void {
    if (!this.position) return;
    this.editPortfolioConfig.fields[0].value = this.position.name;
    this.editPortfolioConfig.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showEditModal = true;
  }
    closeEditModal(): void {
    this.showEditModal = false;
  }


  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  openCancelModal(): void {
    this.showCancelModal = true;
  }
  deletePosition(): void {
    if (!this.position) return;
    this.cargoService.deletePosition(this.position.id)
      .pipe(retry(3))
      .subscribe({
        next: () => {
          this.router.navigate(['/recursos']);
        },
        error: (err) => {
          console.error('Erro ao deletar position:', err);
          alert('Erro ao deletar o position. Tente novamente.');
        }
      });
  }
  onUncancelPosition(): void {
      if (!this.position) return;
      if (this.position.status !== 'CANCELLED') return;
      const updatedPosition = {
        ...this.position,
        status: 'IN_ANALYSIS'
      };
      this.cargoService.updatePosition(this.position.id, updatedPosition)
        .pipe(retry(3))
        .subscribe({
          next: (updatedPosition) => {
            this.loadPositionDetails(this.position!.id);
          },
          error: (err) => {
            alert('Erro ao descancelar o position. Tente novamente.');
          }
        });
    }

}
