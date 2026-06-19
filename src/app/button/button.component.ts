import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertBadgeComponent } from '../alert-badge/alert-badge.component';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 0 | 1 | 2 | 3;
export type ButtonContent = 'only-text' | 'left-icon' | 'right-icon' | 'icon-text-icon' | 'only-icon';
export type ButtonState = 'default' | 'hover' | 'disabled';

@Component({
  selector: 'pds-button',
  standalone: true,
  imports: [CommonModule, AlertBadgeComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() type: ButtonType = 'primary';
  @Input() size: ButtonSize = 1;
  @Input() content: ButtonContent = 'only-text';
  @Input() label = '';
  @Input() leftIcon = '';
  @Input() rightIcon = '';
  @Input() centerIcon = '';
  @Input() disabled = false;
  @Input() forceHover = false;
  @Input() showBadge = false;
  @Input() badgeCount?: number;
  @Input() badgeType: 'count' | 'alert-indicator' = 'alert-indicator';

  get iconFolder(): string {
    const sizePx: Record<ButtonSize, number> = { 0: 16, 1: 20, 2: 24, 3: 28 };
    return `/icons/${sizePx[this.size]}px`;
  }

  get badgeSize(): 0 | 1 {
    return this.size <= 1 ? 0 : 1;
  }

  get hasLeftIcon(): boolean {
    return this.content === 'left-icon' || this.content === 'icon-text-icon';
  }

  get hasRightIcon(): boolean {
    return this.content === 'right-icon' || this.content === 'icon-text-icon';
  }

  get isOnlyIcon(): boolean {
    return this.content === 'only-icon';
  }

  get isDisabled(): boolean {
    return this.disabled;
  }

  get hostClasses(): string[] {
    return [
      'pds-button',
      `pds-button--${this.type}`,
      `pds-button--size-${this.size}`,
      `pds-button--${this.content}`,
      this.disabled ? 'pds-button--disabled' : '',
      this.forceHover && !this.disabled ? 'pds-button--hover' : '',
    ].filter(Boolean);
  }
}
