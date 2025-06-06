import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, FormModalConfig } from '../../interface/interfacies';

@Component({
  selector: 'app-form-modal-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-modal-component.component.html',
  styleUrl: './form-modal-component.component.scss'
})
export class FormModalComponentComponent implements OnInit, OnChanges{
  @Input() isVisible = false;
  @Input() config: FormModalConfig = {
    title: '',
    fields: []
  };
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<FormField[]>();
  @Output() cancel = new EventEmitter<void>();

  showValidationError = false;

  ngOnInit(): void {
    this.resetValidation();
  }

  ngOnChanges(): void {
    if (this.isVisible) {
      this.resetValidation();
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.resetValidation();
    this.close.emit();
  }

  onCancel(): void {
    this.resetValidation();
    this.cancel.emit();
  }

  onSave(): void {
    if (this.validateForm()) {
      this.save.emit(this.config.fields);
      this.resetValidation();
    } else {
      this.showValidationError = true;
    }
  }

  onFieldChange(field: FormField): void {
    // Clear error when user starts typing
    if (field.hasError) {
      field.hasError = false;
      field.errorMessage = '';
      this.showValidationError = false;
    }
  }

  validateField(field: FormField): void {
    if (field.required && (!field.value || field.value.trim() === '')) {
      field.hasError = true;
      field.errorMessage = `${field.label} é obrigatório.`;
    } else {
      field.hasError = false;
      field.errorMessage = '';
    }

    // Additional validation based on field type
    if (field.value && field.value.trim() !== '') {
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            field.hasError = true;
            field.errorMessage = 'Email inválido.';
          }
          break;
        case 'number':
          if (isNaN(Number(field.value))) {
            field.hasError = true;
            field.errorMessage = 'Deve ser um número válido.';
          }
          break;
      }
    }
  }

  validateForm(): boolean {
    let isValid = true;

    this.config.fields.forEach(field => {
      this.validateField(field);
      if (field.hasError) {
        isValid = false;
      }
    });

    return isValid;
  }

  isFormValid(): boolean {
    return this.config.fields.every(field =>
      !field.required || (field.value && field.value.trim() !== '')
    );
  }

  resetValidation(): void {
    this.showValidationError = false;
    this.config.fields.forEach(field => {
      field.hasError = false;
      field.errorMessage = '';
    });
  }
}
