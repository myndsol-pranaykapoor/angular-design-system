import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';

export type CrumbType = 'label' | 'more-options';

@Component({
  selector: 'pds-crumb',
  standalone: true,
  templateUrl: './crumb.component.html',
  styleUrl: './crumb.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CrumbComponent {
  @Input() type: CrumbType = 'label';

  /** Label-type content */
  @Input() label = 'Label';
  /** 20px supporting icon from /icons/20px/ (label type) */
  @Input() icon = 'life-buoy';
  @Input() showIcon = true;

  @Output() crumbClick = new EventEmitter<void>();

  @HostBinding('class') get hostClass(): string {
    return `pds-crumb pds-crumb--${this.type}`;
  }

  @HostListener('click') onClick(): void { this.crumbClick.emit(); }

  get iconUrl(): string {
    const name = this.type === 'more-options' ? 'more-horizontal' : this.icon;
    return `url(/icons/20px/${name}.svg)`;
  }
}
