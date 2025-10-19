import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() color?: string;

  getBadgeClasses(): string {
    return `badge badge-${this.color}`;
  }
}
