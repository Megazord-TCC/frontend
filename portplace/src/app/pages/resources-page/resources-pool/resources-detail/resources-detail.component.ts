import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../components/badge/badge.component';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { CardComponent } from '../../../../components/card/card.component';
import { FormModalComponentComponent } from '../../../../components/form-modal-component/form-modal-component.component';
import { SvgIconComponent } from '../../../../components/svg-icon/svg-icon.component';
import { TableComponent } from '../../../../components/table/table.component';
import { ResourcesPositionComponent } from '../../resources-position/resources-position.component';
import { ResourcesRequestComponent } from '../../resources-request/resources-request.component';
import { ResourcePoolComponent } from '../resources-pool.component';
import { FormField, FormModalConfig } from '../../../../interface/interfacies';

@Component({
  selector: 'app-resources-detail',
  imports: [
    BreadcrumbComponent,
    SvgIconComponent,
    CommonModule,
    FormsModule,
    FormModalComponentComponent,
    BadgeComponent,
    CardComponent,
    TableComponent,
    ResourcesRequestComponent,
    ResourcesPositionComponent,
    ResourcePoolComponent
  ],
  templateUrl: './resources-detail.component.html',
  styleUrl: './resources-detail.component.scss'
})
export class ResourcesDetailComponent {
  createResourcesConfig: FormModalConfig = {
    title: 'Cadastrar novo projeto',
    fields: [
      {
        id: 'name',
        label: 'Nome',
        type: 'text',
        value: '',
        required: true,
        placeholder: 'Digite o nome do projeto'
      },
      {
        id: 'description',
        label: 'Descrição',
        type: 'textarea',
        value: '',
        required: false,
        placeholder: 'Digite a descrição do projeto',
        rows: 4
      },
      {
        id: 'startDate',
        label: 'Início planejado',
        type: 'date',
        value: '',
        required: true
      },
      {
        id: 'endDate',
        label: 'Fim planejado',
        type: 'date',
        value: '',
        required: true
      }
    ],
    validationMessage: 'Os campos marcados com * são obrigatórios.'
  };

  showCreateModal = false;


  constructor() { }

  loadResourceDetail(): void {
    
  }

  openCreateModal(): void {
    // Reset form values
    this.createResourcesConfig.fields.forEach(field => {
      field.value = '';
      field.hasError = false;
      field.errorMessage = '';
    });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onSaveProject(fields: FormField[]): void {
    // Process form data
    const projectData = fields.reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {} as any);

    // this.projetoService.createProject(newProject).subscribe({
    //   next: (createdProject) => {
    //     console.log('Projeto criado:', createdProject);
    //     this.loadResources();
    //     this.resetNewProject();
    //   },
    //   error: (err) => {
    //     console.error('Erro ao criar projeto:', err);
    //   }
    // });
    this.closeCreateModal();
  }

}
