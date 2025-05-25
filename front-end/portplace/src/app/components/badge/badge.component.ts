import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() color: 'gray' | 'green' | 'blue' | 'red' | 'yellow' = 'blue';

  getBadgeClasses(): string {
    return `badge badge-${this.color}`;
  }
}
