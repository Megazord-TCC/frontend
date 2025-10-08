import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../service/portfolio-service';
import { CarlosPortfolioRisksService } from '../../service/carlos-portfolio-risks.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resources-allocation-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './resources-allocation-create.component.html',
  styleUrl: './resources-allocation-create.component.scss'
})
export class ResourcesAllocationCreateComponent {
  @Output() close = new EventEmitter<void>();

  route = inject(ActivatedRoute);
  httpClient = inject(HttpClient);

  // Dados do projeto
  projectName = 'Portfólio 1';
  requesterName = 'Carlos Krefer';

  // Opções mockadas
  positionOptions = [
      { id: '', name: 'Selecione um cargo' },
      { id: '1', name: 'Analista sênior' },
      { id: '2', name: 'Analista pleno' },
      { id: '3', name: 'Desenvolvedor' }
  ];

  collaboratorOptions = [
      { id: '', name: 'Selecione um colaborador' },
      { id: '1', name: 'João' },
      { id: '2', name: 'Maria' },
      { id: '3', name: 'Pedro' }
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

  router = inject(Router);
  portfolioService = inject(PortfolioService);
  riskService = inject(CarlosPortfolioRisksService);
  // Valores selecionados
  selectedPosition = '';
  selectedCollaborator = '';
  selectedHours = '';
  startDate = '';
  endDate = '';
  priority = '';
  isOpen = false;

  errorMessage = '';
  isSubmitButtonDisabled = false;
  mouseDownOnOverlay = false;
  routeSubscription?: Subscription;

  ngOnInit() {
      // Implementar lógica de inicialização se necessário
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
      let isFormValid = await this.isFormValid();
      if (!isFormValid) return;


  }

  onCancel(): void {
      this.close.emit();
  }

  onReject(): void {
      // Implementar lógica de rejeição
      console.log('Pedido rejeitado');
      this.close.emit();
  }

  clearForm(): void {
      this.selectedPosition = '';
      this.selectedCollaborator = '';
      this.selectedHours = '';
      this.startDate = '';
      this.endDate = '';
      this.priority = '';
      this.errorMessage = '';
      this.isSubmitButtonDisabled = false;
  }

  isFormValid(): boolean {
      if (!this.selectedPosition || !this.selectedCollaborator || !this.selectedHours ||
          !this.startDate || !this.endDate || !this.priority) {
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
}
