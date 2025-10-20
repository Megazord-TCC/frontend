  import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../../service/resources.service';
import { CargosService } from '../../service/cargos.service';
import { PositionReadDTO } from '../../interface/cargos-interfaces';
import { AllocationRequestService } from '../../service/allocation-request.service';
import { AllocationRequestCreateDTO, AllocationRequestReadDTO, AllocationRequestStatusEnum, PriorityEnum } from '../../interface/allocation-request-interfaces';
import { Project } from '../../interface/interfacies';
import { ProjetoService } from '../../service/projeto.service';
import { AllocationService } from '../../service/allocation.service';


@Component({
  selector: 'app-resources-allocation-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './resources-allocation-create.component.html',
  styleUrl: './resources-allocation-create.component.scss'
})
export class ResourcesAllocationCreateComponent {
  formatDateForInput(date: string): string {
    if (!date) return '';
    // já está em yyyy-MM-dd
    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoRegex.test(date)) return date;

    // formato ISO com hora -> pega a parte da data
    if (date.includes('T')) return date.split('T')[0];

    // formato dd/MM/yyyy -> converte para yyyy-MM-dd
    const parts = date.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // fallback: tenta criar Date e extrair componentes (pode ter issues de timezone)
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    }
  @Input() allocationRequestId!: number;
  collaboratorOptions: Array<{ id: number | string, name: string }> = [
      { id: '', name: 'Selecione um colaborador' }
  ];
  // Retorna data no formato ISO LocalDate (yyyy-MM-dd) para envio ao backend Java
  formatDateToDDMMYYYY(date: string): string {
      if (!date) return '';
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (isoRegex.test(date)) return date;

      // aceita dd/MM/yyyy
      const parts = date.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      // aceita ISO com hora
      if (date.includes('T')) return date.split('T')[0];

      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  }
  @Output() close = new EventEmitter<void>();

  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);

  // Dados do projeto
  projectName:string = '';
  requesterName:string = '';

  positionOptions: PositionReadDTO[] = [];
  projectOptions: Project[] = [];
  priorityOptions = [
      { id: PriorityEnum.LOW, name: 'Baixa' },
      { id: PriorityEnum.MEDIUM, name: 'Média' },
      { id: PriorityEnum.HIGH, name: 'Alta' }
  ];


  hoursOptions = [
      { id: '', name: 'Selecione horas/dia' },
      { id: '1', name: '1' },
      { id: '2', name: '2' },
      { id: '4', name: '4' },
      { id: '8', name: '8' },
      { id: '9', name: '10' },
      { id: '10', name: '12' },
      { id: '11', name: '14' },
      { id: '12', name: '16' },
      { id: '13', name: '18' }
  ];

  allocationRequestService = inject(AllocationRequestService);
  allocationService = inject(AllocationService);
  router = inject(Router);
  resourcesService = inject(ResourcesService);
  cargosService = inject(CargosService);
  // Valores selecionados
  selectedPosition: number = 0;
  selectedCollaborator: number = 0;
  selectedHours: number = 0;
  selectedProject: number = 0;
  startDate: string = '';
  endDate: string = '';
  priority: PriorityEnum = PriorityEnum.LOW;
  isOpen = false;

  errorMessage = '';
  isSubmitButtonDisabled = false;
  mouseDownOnOverlay = false;
  routeSubscription?: Subscription;

  ngOnInit() {

    this.cargosService.getPositionsUnpaged().subscribe({
      next: (positions) => {
          this.positionOptions = positions;
      },
      error: () => {
          this.positionOptions = [];
      }
    });

    // Carregar colaboradores do pool de recursos
    this.resourcesService.getResourcesUnpaged().subscribe({
      next: (resources: any[]) => {
        console.log("resources", resources);
          this.collaboratorOptions = [
              { id: '', name: 'Selecione um colaborador' },
              ...resources.map(r => ({ id: r.id, name: r.name }))
          ];
      },
      error: () => {
          this.collaboratorOptions = [{ id: '', name: 'Selecione um colaborador' }];
      }
    });

    // Se vier allocationRequestId, buscar dados da request e preencher campos
    if (this.allocationRequestId) {
      this.allocationRequestService.getById(this.allocationRequestId).subscribe({
        next: (data: AllocationRequestReadDTO) => {
            console.log("allocation request data", data);
            this.selectedPosition = data.position?.id ?? 0;
            this.selectedCollaborator = data.allocation?.resource?.id ?? 0;
            this.selectedHours = data.dailyHours ?? 0;
            this.selectedProject = data.project?.id ?? 0;
            this.startDate = data.startDate ?? '';
            this.endDate = data.endDate ?? '';
            this.priority = data.priority ?? PriorityEnum.LOW;
            this.projectName = data.project?.name ?? '';
            this.requesterName = data.createdBy ?? '';
        },
        error: () => {
            this.errorMessage = 'Erro ao carregar dados da solicitação.';
        }
      });
    }
  }

  ngOnDestroy(): void {
      this.routeSubscription?.unsubscribe();
  }

  onOverlayClick(event: MouseEvent): void {
      if (event.target === event.currentTarget && this.mouseDownOnOverlay) this.close.emit();
      this.mouseDownOnOverlay = false;
  }

  onOverlayMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.mouseDownOnOverlay = true;
  }

  async onSave(): Promise<any> {
    let isFormValid = this.isFormValid();
    if (!isFormValid) return;

    // Monta DTO para PUT da allocation request
    const allocationRequestDto = {
        startDate: this.formatDateToDDMMYYYY(this.startDate),
        endDate: this.formatDateToDDMMYYYY(this.endDate),
        dailyHours: Number(this.selectedHours),
        priority: this.priority,
        positionId: Number(this.selectedPosition),
        status: AllocationRequestStatusEnum.ALLOCATED,
    };

    this.isSubmitButtonDisabled = true;
    this.errorMessage = '';

    // Se allocationRequestId, faz PUT antes do create
    if (this.allocationRequestId) {
      await new Promise<void>((resolve, reject) => {
        this.allocationRequestService.update(this.allocationRequestId, allocationRequestDto).subscribe({
          next: () => resolve(),
          error: (err) => {
              this.errorMessage = 'Erro ao atualizar solicitação.';
              this.isSubmitButtonDisabled = false;
              reject(err);
          }
        });
      });
    }

    // Monta DTO de criação de alocação
    const allocationDto = {
      startDate: allocationRequestDto.startDate,
      endDate: allocationRequestDto.endDate,
      dailyHours: allocationRequestDto.dailyHours,
      resourceId: this.selectedCollaborator,
      allocationRequestId: this.allocationRequestId
    };
    this.allocationService.create(allocationDto).subscribe({
      next: () => {
        this.clearForm();
        this.close.emit();
      },
      error: (err) => {
        this.errorMessage = 'Erro ao criar pedido de alocação.';
        this.isSubmitButtonDisabled = false;
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  async onReject(): Promise<any> {
    // mudar status para cancelado
    let isFormValid = this.isFormValid();
    if (!isFormValid) return;

    // Monta DTO para PUT da allocation request
    const allocationRequestDto = {
        startDate: this.formatDateToDDMMYYYY(this.startDate),
        endDate: this.formatDateToDDMMYYYY(this.endDate),
        dailyHours: Number(this.selectedHours),
        priority: this.priority,
        positionId: Number(this.selectedPosition),
        projectId: Number(this.selectedProject),
        collaboratorId: Number(this.selectedCollaborator),
        status: AllocationRequestStatusEnum.CANCELLED
    };

    this.isSubmitButtonDisabled = true;
    this.errorMessage = '';

    // Se allocationRequestId, faz PUT antes do create
    if (this.allocationRequestId) {
      await new Promise<void>((resolve, reject) => {
        this.allocationRequestService.update(this.allocationRequestId, allocationRequestDto).subscribe({
          next: () => resolve(),
          error: (err) => {
              this.errorMessage = 'Erro ao atualizar solicitação.';
              this.isSubmitButtonDisabled = false;
              reject(err);
          }
        });
      });
    }
    this.close.emit();
  }

  clearForm(): void {
    this.selectedPosition = 0;
    this.selectedCollaborator = 0;
    this.selectedHours = 0;
    this.startDate = '';
    this.endDate = '';
    this.priority = PriorityEnum.LOW;
    this.errorMessage = '';
    this.isSubmitButtonDisabled = false;
  }

  isFormValid(): boolean {
    if (
      this.selectedPosition == null ||
      this.selectedCollaborator == null ||
      this.selectedHours == null ||
      this.startDate == null ||
      this.endDate == null ||
      this.priority == null
    ) {
      this.errorMessage = 'Os campos marcados com * são obrigatórios.';
      return false;
    }
    this.errorMessage = '';
    return true;
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
}
