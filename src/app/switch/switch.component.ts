import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export type SwitchSize = 0 | 1 | 2;

@Component({
  selector: 'pds-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SwitchComponent {
  @Input() on = false;
  @Input() size: SwitchSize = 1;
  @Input() disabled = false;

  @Output() switched = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.switched.emit(!this.on);
    }
  }

  get hostClasses(): string[] {
    return [
      'pds-switch',
      `pds-switch--size-${this.size}`,
      this.on ? 'pds-switch--on' : 'pds-switch--off',
      this.disabled ? 'pds-switch--disabled' : '',
    ].filter(Boolean);
  }
}
