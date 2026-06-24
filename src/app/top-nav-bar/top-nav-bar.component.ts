import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { TopNavTabComponent } from '../top-nav-tab/top-nav-tab.component';

export interface TopNavBarTab {
  label: string;
  icon?: string;
  showIcon?: boolean;
  showAlertBadge?: boolean;
  badgeCount?: number;
}

@Component({
  selector: 'pds-top-nav-bar',
  standalone: true,
  imports: [TopNavTabComponent],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TopNavBarComponent {
  @Input() tabs: TopNavBarTab[] = [];
  /** Index of the single selected tab (only one at a time) */
  @Input() selectedIndex = 0;
  /** When true, the bar is position:fixed directly below the command bar (app-shell use) */
  @Input() sticky = false;

  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() tabSelect = new EventEmitter<{ index: number; tab: TopNavBarTab }>();

  @HostBinding('class') readonly hostClass = 'pds-top-nav-bar';
  @HostBinding('class.pds-top-nav-bar--sticky') get isSticky(): boolean { return this.sticky; }
  @HostBinding('attr.role') readonly role = 'tablist';

  select(index: number): void {
    if (index === this.selectedIndex) return;
    this.selectedIndex = index;
    this.selectedIndexChange.emit(index);
    this.tabSelect.emit({ index, tab: this.tabs[index] });
  }
}
