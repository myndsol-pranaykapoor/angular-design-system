import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

export interface TabBarItem {
  label: string;
  icon?: string;
  showIcon?: boolean;
  showAlertBadge?: boolean;
  badgeCount?: number;
}

@Component({
  selector: 'pds-tab-bar',
  standalone: true,
  imports: [TabComponent],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TabBarComponent {
  @Input() items: TabBarItem[] = [];
  /** Index of the single selected tab (only one at a time) */
  @Input() selectedIndex = 0;

  @Output() selectedIndexChange = new EventEmitter<number>();
  @Output() tabSelect = new EventEmitter<{ index: number; item: TabBarItem }>();

  @HostBinding('class') readonly hostClass = 'pds-tab-bar';
  @HostBinding('attr.role') readonly role = 'tablist';

  select(index: number): void {
    if (index === this.selectedIndex) return;
    this.selectedIndex = index;
    this.selectedIndexChange.emit(index);
    this.tabSelect.emit({ index, item: this.items[index] });
  }
}
