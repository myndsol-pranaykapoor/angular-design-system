import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SideMenuItemComponent } from '../side-menu-item/side-menu-item.component';
import {
  SideMenuItemsCollectionComponent,
  CollectionItem,
} from '../side-menu-items-collection/side-menu-items-collection.component';

export interface SideMenuEntry {
  id: string;
  title: string;
  icon: string;
  type: 'collection' | 'item';
  items?: CollectionItem[];
}

@Component({
  selector: 'pds-side-menu',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SideMenuItemComponent, SideMenuItemsCollectionComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SideMenuComponent {
  @Input() entries: SideMenuEntry[] = [];
  @Input() version = '1.1';

  /** Icons for the 3 secondary action buttons (expanded state) */
  @Input() action1Icon = 'help-circle';
  @Input() action2Icon = 'settings';
  @Input() action3Icon = 'log-out';

  @Output() itemSelected = new EventEmitter<string>();
  @Output() action1Click = new EventEmitter<void>();
  @Output() action2Click = new EventEmitter<void>();
  @Output() action3Click = new EventEmitter<void>();

  /** Collapsed is the default state */
  isExpanded = false;

  /** Which collection is currently open (expanded parent only) */
  expandedCollectionId = '';

  /** Globally selected leaf item */
  selectedItemId = '';

  /** Which collection contains the selected leaf item */
  selectedCollectionId = '';

  get versionLabel(): string {
    return this.isExpanded ? `Version ${this.version}` : `V ${this.version}`;
  }

  onMouseEnter(): void {
    this.isExpanded = true;
    // Re-expand the collection holding the current selection so it's visible
    if (this.selectedCollectionId) {
      this.expandedCollectionId = this.selectedCollectionId;
    }
  }

  onMouseLeave(): void {
    this.isExpanded = false;
    // Collections collapse when the parent collapses
    this.expandedCollectionId = '';
  }

  onCollectionToggle(colId: string): void {
    this.expandedCollectionId = this.expandedCollectionId === colId ? '' : colId;
  }

  onCollectionItemSelected(itemId: string, colId: string): void {
    this.selectedItemId = itemId;
    this.selectedCollectionId = colId;
    this.expandedCollectionId = colId;
    this.itemSelected.emit(itemId);
  }

  onStandaloneItemSelected(itemId: string): void {
    this.selectedItemId = itemId;
    this.selectedCollectionId = '';
    this.itemSelected.emit(itemId);
  }

  /**
   * Collection header shows as selected when:
   * - Collapsed: it contains the globally selected item (so the user knows
   *   under which collection the selection was made)
   * - Expanded:  it is the currently open collection
   */
  collectionHeaderSelected(colId: string): boolean {
    return this.isExpanded
      ? this.expandedCollectionId === colId
      : this.selectedCollectionId === colId;
  }
}
