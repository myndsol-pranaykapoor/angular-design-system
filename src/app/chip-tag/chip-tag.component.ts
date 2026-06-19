import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export type ChipTagType = 'filled' | 'border';
export type ChipTagSize = 0 | 1;
export type ChipTagColorScheme = 'default' | 'success' | 'error' | 'alert' | 'muted';

@Component({
  selector: 'pds-chip-tag',
  standalone: true,
  templateUrl: './chip-tag.component.html',
  styleUrl: './chip-tag.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ChipTagComponent {
  @Input() type: ChipTagType = 'filled';
  @Input() size: ChipTagSize = 0;
  /** Semantic colour override (used for the upload count badges) */
  @Input() colorScheme: ChipTagColorScheme = 'default';
  @Input() label = '';
  @Input() supportingIcon = '';
  @Input() showSupportingIcon = false;
  @Input() showAction = false;
  @Input() disabled = false;

  @Output() actionClick = new EventEmitter<void>();

  get iconSize(): number {
    return this.size === 0 ? 12 : 16;
  }

  get iconFolder(): string {
    return `/icons/${this.iconSize}px`;
  }

  get hostClasses(): string[] {
    return [
      'pds-chip-tag',
      `pds-chip-tag--${this.type}`,
      `pds-chip-tag--size-${this.size}`,
      this.showSupportingIcon ? 'pds-chip-tag--has-icon' : 'pds-chip-tag--no-icon',
      this.showAction ? 'pds-chip-tag--has-action' : 'pds-chip-tag--no-action',
      this.colorScheme !== 'default' ? `pds-chip-tag--${this.colorScheme}` : '',
      this.disabled ? 'pds-chip-tag--disabled' : '',
    ].filter(Boolean);
  }

  onActionClick(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.actionClick.emit();
    }
  }
}
