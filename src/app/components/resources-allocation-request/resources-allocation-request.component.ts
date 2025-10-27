import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../../service/resources.service';
import { CargosService } from '../../service/cargos.service';
import { PositionReadDTO, PositionStatusEnum } from '../../interface/cargos-interfaces';
import { AllocationRequestService } from '../../service/allocation-request.service';
import { PriorityEnum } from '../../interface/allocation-request-interfaces';
import { Project } from '../../interface/interfacies';
import { ProjetoService } from '../../service/projeto.service';


@Component({
  selector: 'app-resources-allocation-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './resources-allocation-request.component.html',
  styleUrl: './resources-allocation-request.component.scss'
})
export class ResourcesAllocationRequestComponent {
  token: string = '';
  name: string = '';
  roleFrontend: string = '';
  tokenPaylod: any = null;

  setUserDataFromLocalStorage(): void {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        this.token = userData.token;
        this.name = userData.name;
        this.roleFrontend = userData.roleFrontend;
        this.tokenPaylod = userData.tokenPaylod;
    }
  }
  formatDateToDDMMYYYY(date: string): string {
      if (!date) return '';
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
  }
  @Output() close = new EventEmitter<void>();

  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);


  requesterName = '';

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

  allocationService = inject(AllocationRequestService);
  router = inject(Router);
  portfolioService = inject(PortfolioService);
  riskService = inject(CarlosPortfolioRisksService);
  resourcesService = inject(ResourcesService);
  cargosService = inject(CargosService);
  projectService = inject(ProjetoService);
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
                this.positionOptions = positions.filter(p => p.status == PositionStatusEnum.ACTIVE);
            },
            error: () => {
                this.positionOptions = [];
            }
        });
    this.projectService.getProjectsUnpaged().subscribe({
        next: (projects) => {
            this.projectOptions = projects.filter(p => p.status == 'IN_PROGRESS');
        },
        error: () => {
            this.projectOptions = [];
        }
    });

    this.setUserDataFromLocalStorage();
    this.requesterName = this.name;
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

    // Monta DTO de criação
    const dto = {
        startDate: this.formatDateToDDMMYYYY(this.startDate),
        endDate: this.formatDateToDDMMYYYY(this.endDate),
        dailyHours: Number(this.selectedHours),
        priority: this.priority,
        positionId: Number(this.selectedPosition),
        projectId: Number(this.selectedProject)
    };
    console.log('DTO a ser enviado:', dto);
    this.isSubmitButtonDisabled = true;
    this.errorMessage = '';
    this.allocationService.create(dto).subscribe({
        next: () => {
            this.clearForm();
            this.close.emit(); // Fecha modal após criar
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
