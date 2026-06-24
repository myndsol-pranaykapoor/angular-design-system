import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { AlertBadgeComponent } from '../alert-badge/alert-badge.component';

@Component({
  selector: 'pds-tab',
  standalone: true,
  imports: [AlertBadgeComponent],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TabComponent {
  /** Selected (true) shows the Primary/3 fill + Elevation/2; false has the default & hover states */
  @Input() selected = false;

  @Input() label = 'Label';
  /** 20px supporting icon name from /icons/20px/ — empty hides it */
  @Input() icon = 'life-buoy';
  @Input() showIcon = true;

  @Input() showAlertBadge = true;
  @Input() badgeCount = 3;

  @Output() tabClick = new EventEmitter<void>();

  @HostBinding('class') get hostClass(): string {
    return `pds-tab ${this.selected ? 'pds-tab--selected' : 'pds-tab--unselected'}`;
  }
  @HostBinding('attr.role') readonly role = 'tab';
  @HostBinding('attr.tabindex') readonly tabindex = '0';
  @HostBinding('attr.aria-selected') get ariaSelected(): boolean { return this.selected; }

  @HostListener('click') onClick(): void { this.tabClick.emit(); }

  get iconUrl(): string { return `url(/icons/20px/${this.icon}.svg)`; }
}
