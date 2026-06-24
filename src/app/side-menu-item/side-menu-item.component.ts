import { Component, Input, Output, EventEmitter, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'pds-side-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu-item.component.html',
  styleUrl: './side-menu-item.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SideMenuItemComponent {
  /** Display label */
  @Input() title = 'Menu Item';

  /** Supporting icon name from /icons/16px/ — empty string hides the icon */
  @Input() icon = '';

  /** Show/hide the chevron indicator */
  @Input() showChevron = false;

  /** When true chevron shows chevron-up; when false shows chevron-down */
  @Input() isExpanded = false;

  /** Active/selected state */
  @Input() selected = false;

  @Output() itemClick = new EventEmitter<void>();

  isHovered = false;

  private readonly themeService = inject(ThemeService);

  get hostClasses(): Record<string, boolean> {
    return {
      'pds-side-menu-item': true,
      'pds-side-menu-item--default-hover':  !this.selected && this.isHovered,
      'pds-side-menu-item--selected':        this.selected && !this.isHovered,
      'pds-side-menu-item--selected-hover':  this.selected && this.isHovered,
      'pds-side-menu-item--expanded':        this.isExpanded,
    };
  }

  get iconPath(): string {
    return `/icons/16px/${this.icon}.svg`;
  }

  /** Dual-colour SVG used for default & default-hover states (preserves themed Primary/3 + Secondary/3).
   *  ACT (default) lives at the top level; other products in a per-theme folder. */
  get dualIconPath(): string {
    const theme = this.themeService.theme();
    const base = theme === 'act' ? '/dual-colour-icons' : `/dual-colour-icons/${theme}`;
    return `${base}/16px/${this.icon}.svg`;
  }

  get chevronPath(): string {
    return `/icons/16px/chevron-down.svg`;
  }
}
