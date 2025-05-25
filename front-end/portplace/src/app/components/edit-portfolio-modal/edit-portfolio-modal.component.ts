import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-portfolio-modal',
  imports: [FormsModule],
  templateUrl: './edit-portfolio-modal.component.html',
  styleUrl: './edit-portfolio-modal.component.scss'
})
export class EditPortfolioModalComponent implements OnInit {
  @Input() portfolio: any;
  @Output() close = new EventEmitter<void>();

  name = '';
  description = '';

  ngOnInit(): void {
    if (this.portfolio) {
      this.name = this.portfolio.name;
      this.description = this.portfolio.description;
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
    if (this.portfolio) {
      this.name = this.portfolio.name;
      this.description = this.portfolio.description;
    }
    this.close.emit();
  }

  onSave(): void {
    // Save logic here
    this.close.emit();
  }
}
