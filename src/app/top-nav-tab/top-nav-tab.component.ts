import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ViewEncapsulation } from '@angular/core';
import { AlertBadgeComponent } from '../alert-badge/alert-badge.component';

@Component({
  selector: 'pds-top-nav-tab',
  standalone: true,
  imports: [AlertBadgeComponent],
  templateUrl: './top-nav-tab.component.html',
  styleUrl: './top-nav-tab.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TopNavTabComponent {
  /** Selected (Primary/3 fill + Grey/0 content) vs not-selected (default & hover) */
  @Input() selected = false;

  @Input() label = 'Label';
  /** 20px supporting icon from /icons/20px/ — empty hides it */
  @Input() icon = 'life-buoy';
  @Input() showIcon = true;

  @Input() showAlertBadge = true;
  @Input() badgeCount = 3;

  @Output() tabClick = new EventEmitter<void>();

  @HostBinding('class') get hostClass(): string {
    return `pds-top-nav-tab ${this.selected ? 'pds-top-nav-tab--selected' : 'pds-top-nav-tab--unselected'}`;
  }
  @HostBinding('attr.role') readonly role = 'tab';
  @HostBinding('attr.tabindex') readonly tabindex = '0';
  @HostBinding('attr.aria-selected') get ariaSelected(): boolean { return this.selected; }

  @HostListener('click') onClick(): void { this.tabClick.emit(); }

  get iconUrl(): string { return `url(/icons/20px/${this.icon}.svg)`; }
}
