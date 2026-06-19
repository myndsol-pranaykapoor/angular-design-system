import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuItemComponent } from '../side-menu-item/side-menu-item.component';

export interface CollectionLeafItem {
  id: string;
  title: string;
  icon?: string;
}

export interface CollectionItem extends CollectionLeafItem {
  /** Presence of children makes this item expandable (level-two-expandable) */
  children?: CollectionLeafItem[];
}

@Component({
  selector: 'pds-side-menu-items-collection',
  standalone: true,
  imports: [CommonModule, SideMenuItemComponent],
  templateUrl: './side-menu-items-collection.component.html',
  styleUrl: './side-menu-items-collection.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SideMenuItemsCollectionComponent {
  /** Header label */
  @Input() title = '';

  /** Header supporting icon name from /icons/16px/ */
  @Input() icon = '';

  /** Child items — CollectionItem with optional children for expandable level-2 */
  @Input() items: CollectionItem[] = [];

  /** Expand/collapse state — controlled by parent (Side Menu) */
  @Input() isExpanded = false;

  /** Override header selected appearance — when null, follows isExpanded */
  @Input() headerSelected: boolean | null = null;

  /** Globally selected item id — controlled by parent (Side Menu) */
  @Input() selectedId = '';

  get resolvedHeaderSelected(): boolean {
    // Explicit headerSelected takes precedence
    if (this.headerSelected !== null) {
      return this.headerSelected;
    }

    // Check if any item in the collection is selected (including nested children)
    if (this.selectedId) {
      return this.isAnyItemSelected();
    }

    // Default: selected when expanded
    return this.isExpanded;
  }

  private isAnyItemSelected(): boolean {
    for (const item of this.items) {
      // Check if the item itself is selected
      if (item.id === this.selectedId) {
        return true;
      }
      // Check if any of its children are selected
      if (item.children?.some(child => child.id === this.selectedId)) {
        return true;
      }
    }
    return false;
  }

  /** Emitted when user clicks the collection header — parent toggles isExpanded */
  @Output() expandToggle = new EventEmitter<void>();

  /** Emitted with the clicked item's id — parent updates selectedId */
  @Output() itemSelected = new EventEmitter<string>();

  /** Which level-2 expandable is open (local state) */
  expandedLevel2Id = '';

  onHeaderClick(): void {
    this.expandToggle.emit();
  }

  onLevel2Click(item: CollectionItem): void {
    if (item.children?.length) {
      this.expandedLevel2Id = this.expandedLevel2Id === item.id ? '' : item.id;
    }
    this.itemSelected.emit(item.id);
  }

  onLeafClick(id: string): void {
    this.itemSelected.emit(id);
  }

  isLevel2Open(id: string): boolean {
    return this.expandedLevel2Id === id;
  }
}
