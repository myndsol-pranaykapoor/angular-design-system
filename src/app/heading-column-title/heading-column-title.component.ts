import {
  Component, Input, Output, EventEmitter,
  HostBinding, ViewEncapsulation, ChangeDetectorRef, inject,
} from '@angular/core';
import { CheckboxComponent, CheckboxType } from '../checkbox/checkbox.component';

export type HeadingColumnTitleType = 'checkbox' | 'text';

@Component({
  selector: 'pds-heading-column-title',
  standalone: true,
  imports: [CheckboxComponent],
  templateUrl: './heading-column-title.component.html',
  styleUrl: './heading-column-title.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HeadingColumnTitleComponent {
  @HostBinding('class') get hostClass(): string {
    const shrinkClass = (this.type === 'checkbox' || this.shrink) ? 'pds-heading-column-title--shrink' : 'pds-heading-column-title--grow';
    return `pds-heading-column-title pds-heading-column-title--${this.type} ${shrinkClass}`;
  }

  private readonly cdr = inject(ChangeDetectorRef);

  @Input() type: HeadingColumnTitleType = 'text';
  @Input() label = 'Column Title';
  /** When true, column hugs its content width instead of flex-growing */
  @Input() shrink = false;

  /** Initial checkbox state; internal state tracks subsequent toggles */
  @Input() set checked(v: CheckboxType) { this._checkboxType = v; }

  @Output() checkboxChange = new EventEmitter<CheckboxType>();

  protected _checkboxType: CheckboxType = 'cleared';

  protected onCheckboxToggle(next: CheckboxType): void {
    this._checkboxType = next;
    this.checkboxChange.emit(next);
    this.cdr.detectChanges();
  }
}
