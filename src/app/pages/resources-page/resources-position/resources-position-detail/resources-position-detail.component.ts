import { Component, inject } from '@angular/core';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { FormField, FormModalConfig } from '../../../../interface/interfacies';
import { PositionReadDTO, PositionStatusEnum } from '../../../../interface/cargos-interfaces';
import { CargosService } from '../../../../service/cargos.service';
import { retry } from 'rxjs';
import { BreadcrumbService } from '../../../../service/breadcrumb.service';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { FormModalComponentComponent } from '../../../../components/form-modal-component/form-modal-component.component';

@Component({
  selector: 'app-resources-position-detail',
  imports: [
    SvgIconComponent,
    BadgeComponent,
    BreadcrumbComponent,
    CommonModule,
    FormModalComponentComponent
  ],
  templateUrl: './resources-position-detail.component.html',
  styleUrl: './resources-position-detail.component.scss'
})
export class ResourcesPositionDetailComponent {
  editPositionConfig: FormModalConfig = {
      title: 'Editar posição',
      fields: [
        {
          id: 'name',
          label: 'Nome',
          type: 'text',
          value: '',
          required: true,
          placeholder: 'Digite o nome da posição'
        }
      ],
      validationMessage: 'Os campos marcados com * são obrigatórios.'
  };
  showEditModal: boolean = false;
  showCancelModal: boolean = false;
  position: PositionReadDTO | null = null;
  router = inject(Router);
  cargoService = inject(CargosService);
  breadCrumbService = inject(BreadcrumbService);
  constructor() {
    const urlSegments = this.router.url.split('/');
    const positionId = Number(urlSegments[urlSegments.length - 1]);
    this.loadPositionDetails(positionId);
    this.breadCrumbService.setBreadcrumbs([
      { label: 'Recursos', url: '/recursos', isActive: false },
      { label: 'Detalhes do recurso', url: `/recursos/${positionId}`, isActive: true }
    ]);
  }
  loadPositionDetails(positionId: number): void {
    this.cargoService.getPositionById(positionId)
      .pipe(retry(5))
      .subscribe({
        next: (positionDto) => {


          console.log('Detalhes da posição:', positionDto);
          this.position = positionDto;

          this.breadCrumbService.setBreadcrumbs([
            { label: 'Início', url: '/inicio', isActive: false },
            { label: 'Recursos', url: '/recursos', isActive: false },
            { label: `Detalhes do recurso: ${this.position?.name}`, url: `/recursos/${this.position?.id}`, isActive: true }
          ]);
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do projeto:', err);
          this.router.navigate(['/projects']);
        }
      });
  }
  getPositionStatusEnumToText = (statusEnum: any): string => {
      switch (statusEnum) {
          case "ACTIVE": return "ATIVO";
          case "INACTIVE": return "INATIVO";
          default: return "SEM STATUS";
      }
  }

  getPositionStatusColor(status: any): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      default:
        return 'gray';
    }
  }
  goBack(): void {
    this.router.navigate(['/recursos']);
  }
  openEditModal(): void {
    if (!this.position) return;
    this.editPositionConfig.fields[0].value = this.position.name;
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
    if (this.position.status !== PositionStatusEnum.INACTIVE) return;
    const updatedPosition = {
      ...this.position,
      status: PositionStatusEnum.ACTIVE
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
  isInactive(): boolean {
    return this.position?.status === 'INACTIVE';
  }
  onCancelPosition(): void {
    if (!this.position) return;


    const updatedPosition = {
      ...this.position,
      status: PositionStatusEnum.INACTIVE,

    };

    this.cargoService.updatePosition(this.position.id, updatedPosition)
    .pipe(retry(3))
    .subscribe({
      next: (updatedPosition) => {
        this.closeCancelModal();
        this.loadPositionDetails(this.position!.id);
        setTimeout(() => {
          this.router.navigate(['/recursos']);
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao cancelar posição:', err);
        console.error('Detalhes do erro:', err.error);
        alert('Erro ao cancelar a posição. Tente novamente.');
      }
    });
  }
  updatePositionField(fields: FormField[]): void {
    if (!this.position) return;

    // Utiliza os valores dos fields recebidos para atualizar a posição
    const fieldMap: { [key: string]: any } = {};
    fields.forEach(field => {
      fieldMap[field.id] = field.value;
    });



    const updatedPosition = {
      name: fieldMap['name'] !== undefined ? fieldMap['name'] : this.position.name,

      status: this.position.status,

    };

    this.cargoService.updatePosition(this.position.id, updatedPosition)
      .pipe(retry(3))
      .subscribe({
        next: (updatedPosition) => {
          this.position = updatedPosition;
          this.loadPositionDetails(this.position!.id);
        },
        error: (err) => {
          alert('Erro ao salvar. Tente novamente.');
        }
      });
      this.showEditModal = false;
  }

}
