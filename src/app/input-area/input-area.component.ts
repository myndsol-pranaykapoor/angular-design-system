import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pds-input-area',
  standalone: true,
  templateUrl: './input-area.component.html',
  styleUrl: './input-area.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class InputAreaComponent {
  @Input() placeholder = 'Place holder';
  @Input() value = '';

  /** Supporting icon — 16px · leading · only when set */
  @Input() supportingIcon = '';
  /** Action icon — 16px · trailing · only when set (e.g. chevron-down for drop down) */
  @Input() actionIcon = '';

  /** When false the text is a read-only display (e.g. drop down / calendar trigger) */
  @Input() editable = true;
  /** Multi-line text area (taller, top-aligned) */
  @Input() multiline = false;
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<void>();

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.valueChange.emit(this.value);
  }

  onActionClick(event: Event): void {
    event.stopPropagation();                  // don't bubble to the input-area's own click
    if (!this.disabled) this.actionClick.emit();
  }
}
