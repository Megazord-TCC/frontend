import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-risk-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-modal.component.html',
  styleUrl: './risk-modal.component.scss'
})
export class RiskModalComponent implements OnInit {
  @Input() risk: any;
  @Output() close = new EventEmitter<void>();

  name = '';
  description = '';
  showValidation = false;
  isEditing = false;

  ngOnInit(): void {
    this.isEditing = !!this.risk;
    if (this.risk) {
      this.name = this.risk.name;
      this.description = this.risk.description || '';
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.name = this.risk?.name || '';
    this.description = this.risk?.description || '';
    this.showValidation = false;
    this.close.emit();
  }

  onSave(): void {
    if (!this.name.trim()) {
      this.showValidation = true;
      return;
    }

    // Save logic here
    this.name = '';
    this.description = '';
    this.showValidation = false;
    this.close.emit();
  }
}
