import { Component, Input, ViewEncapsulation } from '@angular/core';

export type DateTimeSelectionState =
  | 'default'
  | 'default-hover'
  | 'now'
  | 'now-hover'
  | 'selected-range'
  | 'selected-range-hover'
  | 'selected'
  | 'excluded';

@Component({
  selector: 'pds-date-time-selection-state',
  standalone: true,
  templateUrl: './date-time-selection-state.component.html',
  styleUrl: './date-time-selection-state.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DateTimeSelectionStateComponent {
  @Input() state: DateTimeSelectionState = 'default';
  @Input() label = '';

  get hostClasses(): string[] {
    return [
      'pds-dt-state',
      `pds-dt-state--${this.state}`,
    ];
  }
}
