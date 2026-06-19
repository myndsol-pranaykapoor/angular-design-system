import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pds-alert-badge',
  standalone: true,
  templateUrl: './alert-badge.component.html',
  styleUrl: './alert-badge.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AlertBadgeComponent {
  @Input() type: 'count' | 'alert-indicator' = 'alert-indicator';
  @Input() size: 0 | 1 = 0;
  @Input() count?: number;

  get displayCount(): string | null {
    if (this.type !== 'count' || this.count === undefined || this.count < 0) {
      return null;
    }
    return this.count > 99 ? '99+' : String(this.count);
  }

  get isVisible(): boolean {
    if (this.type === 'alert-indicator') return true;
    return this.displayCount !== null;
  }
}
