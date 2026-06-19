import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export type RadioSize = 0 | 1 | 2;

@Component({
  selector: 'pds-radio',
  standalone: true,
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RadioComponent {
  @Input() selected = false;
  @Input() size: RadioSize = 1;
  @Input() disabled = false;
  @Input() name = '';
  @Input() value: string = '';

  @Output() changed = new EventEmitter<void>();

  select(): void {
    if (!this.disabled) {
      this.changed.emit();
    }
  }

  get hostClasses(): string[] {
    return [
      'pds-radio',
      `pds-radio--size-${this.size}`,
      this.selected ? 'pds-radio--selected' : 'pds-radio--cleared',
      this.disabled ? 'pds-radio--disabled' : '',
    ].filter(Boolean);
  }
}
