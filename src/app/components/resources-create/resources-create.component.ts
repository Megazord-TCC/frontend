import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourcesService } from '../../service/resources.service';
import { ResourceCreateDTO } from '../../interface/resources-interface';
import { CargosService } from '../../service/cargos.service';
import { PositionReadDTO, PositionStatusEnum } from '../../interface/cargos-interfaces';

@Component({
    selector: 'app-resources-create',
    imports: [CommonModule, FormsModule],
    templateUrl: './resources-create.component.html',
    styleUrl: './resources-create.component.scss'
})
export class ResourcesCreateComponent {
    @Output() close = new EventEmitter<void>();

    resourcesService = inject(ResourcesService);
    cargosService = inject(CargosService);

    positionOptions: PositionReadDTO[] = [];
    hoursOptions = [
        { id: '', name: 'Selecione horas/dia' },
        { id: '1', name: '1' },
        { id: '2', name: '2' },
        { id: '3', name: '3' },
        { id: '4', name: '4' },
        { id: '5', name: '5' },
        { id: '6', name: '6' },
        { id: '7', name: '7' },
        { id: '8', name: '8' }
    ];

    selectedPosition: string = '';
    selectedCollaborator: string = '';
    selectedHours: string = '';
    description: string = '';
    errorMessage = '';
    isSubmitButtonDisabled = false;
    isOpen = false;

    ngOnInit() {
        this.cargosService.getPositionsUnpaged().subscribe({
            next: (positions) => {
                this.positionOptions = positions.filter(p => p.status == PositionStatusEnum.ACTIVE);
            },
            error: () => {
                this.positionOptions = [];
            }
        });
    }

    async onSave(): Promise<any> {
        if (!this.selectedPosition || !this.selectedCollaborator || !this.selectedHours) {
            this.errorMessage = 'Os campos marcados com * são obrigatórios.';
            return;
        }
        const dailyHoursNum = Number(this.selectedHours);
        if (isNaN(dailyHoursNum) || dailyHoursNum < 0 || dailyHoursNum > 24) {
            this.errorMessage = 'Horas/dia devem ser entre 0 e 24.';
            return;
        }
        const resourceDTO: ResourceCreateDTO = {
            name: this.selectedCollaborator,
            description: this.description,
            dailyHours: dailyHoursNum,
            positionId: Number(this.selectedPosition)
        };
        this.isSubmitButtonDisabled = true;
        this.resourcesService.createResource(resourceDTO).subscribe({
            next: () => {
                this.errorMessage = '';
                this.close.emit();
            },
            error: (err) => {
                this.errorMessage = 'Erro ao criar recurso: ' + (err?.error?.message || '');
                this.isSubmitButtonDisabled = false;
            }
        });
    }

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }

    selectOption(option: any): void {
        this.selectedHours = option.name;
        this.isOpen = false;
    }
    onCustomSelectKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            this.toggleDropdown();
            event.preventDefault();
        }
    }
    onCancel(): void {
        this.close.emit();
    }
    onOverlayClick(event: MouseEvent): void {
      if (event.target === event.currentTarget && this.isOpen) {
          this.onCancel();
      }
    }


}
