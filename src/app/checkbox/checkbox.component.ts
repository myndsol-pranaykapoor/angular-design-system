import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export type CheckboxType = 'checked' | 'indeterminate' | 'cleared';
export type CheckboxSize = 0 | 1 | 2;

@Component({
  selector: 'pds-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxComponent {
  @Input() type: CheckboxType = 'cleared';
  @Input() size: CheckboxSize = 1;
  @Input() disabled = false;

  @Output() changed = new EventEmitter<CheckboxType>();

  toggle(): void {
    if (this.disabled) return;
    const next: CheckboxType =
      this.type === 'cleared'       ? 'checked' :
      this.type === 'checked'       ? 'indeterminate' : 'cleared';
    this.changed.emit(next);
  }

  get hostClasses(): string[] {
    return [
      'pds-checkbox',
      `pds-checkbox--size-${this.size}`,
      `pds-checkbox--${this.type}`,
      this.disabled ? 'pds-checkbox--disabled' : '',
    ].filter(Boolean);
  }

  get iconPath(): string {
    const px: Record<CheckboxSize, string> = { 0: '12', 1: '16', 2: '20' };
    return `/icons/${px[this.size]}px`;
  }

  get iconName(): string {
    return this.type === 'checked' ? 'check' : 'minus';
  }
}
