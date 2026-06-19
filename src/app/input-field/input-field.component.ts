import { Component, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, HostBinding, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LabelContainerComponent } from '../label-container/label-container.component';
import { InputAreaComponent } from '../input-area/input-area.component';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { UploadFilesComponent, UploadFile } from '../upload-files/upload-files.component';

export type InputFieldType = 'field' | 'drop-down' | 'calendar' | 'attachment' | 'text-area';
export type InputFieldState = 'default' | 'value' | 'disabled' | 'error' | 'warning' | 'accepted';

@Component({
  selector: 'pds-input-field',
  standalone: true,
  imports: [LabelContainerComponent, InputAreaComponent, SelectorComponent, DatePickerComponent, UploadFilesComponent],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class InputFieldComponent implements OnDestroy {
  @Input() type: InputFieldType = 'field';
  @Input() state: InputFieldState = 'default';

  @Input() label = 'Label';
  @Input() showOptional = false;
  @Input() showInfo = false;

  @Input() value = '';
  @Input() placeholder = '';                  // empty = use the type's default

  /** Options for the drop-down selector overlay */
  @Input() options: string[] = [];

  @Input() showSupportingMessage = false;
  @Input() supportingMessage = 'Supporting message !';

  /**
   * Validate the entered value and drive the state.
   * Return { state, message } to switch to accepted / warning / error (with its message),
   * or null when there is nothing to flag.
   */
  @Input() validate?: (value: string) => { state: InputFieldState; message?: string } | null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<void>();

  /** Validation result — overrides the `state` input once the user enters a value */
  private validationState: InputFieldState | null = null;
  private validationMessage: string | null = null;

  constructor(private host: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void { this.removeReposition(); }

  /** Effective state — the validation result if present, otherwise the `state` input */
  get effectiveState(): InputFieldState {
    return this.validationState ?? this.state;
  }
  get effectiveMessage(): string {
    return this.validationMessage ?? this.supportingMessage;
  }
  get hasMessage(): boolean {
    return this.showSupportingMessage || this.validationMessage !== null;
  }

  /** Set the value, run validation, emit */
  private applyValue(v: string): void {
    this.value = v;
    if (this.validate) {
      const result = v ? this.validate(v) : null;
      this.validationState = result ? result.state : null;
      this.validationMessage = result ? (result.message ?? null) : null;
    }
    this.valueChange.emit(v);
  }

  protected onValueChange(v: string): void { this.applyValue(v); }

  @HostBinding('class') get hostClass(): string {
    return `pds-input-field pds-input-field--${this.effectiveState} pds-input-field--type-${this.type}`;
  }

  // ── OVERLAY POSITIONING (drop-down & calendar) ───────────────────────────
  protected dropdownOpen = false;
  protected dropdownTop = 0;
  protected dropdownLeft = 0;
  protected dropdownWidth = 0;

  protected datePickerOpen = false;
  protected anchorTop = 0;
  protected anchorLeft = 0;

  get selectorOptions(): SelectorOption[] {
    return this.options.map(o => ({ label: o, checked: o === this.value }));
  }

  private inputAreaRect(): DOMRect | null {
    const ia = this.host.nativeElement.querySelector('.pds-input-area') as HTMLElement | null;
    return ia ? ia.getBoundingClientRect() : null;
  }

  /** Recompute overlay coords from the input-area's current position (called on scroll/resize) */
  private readonly reposition = (): void => {
    const r = this.inputAreaRect();
    if (!r) return;
    if (this.dropdownOpen) {
      this.dropdownTop = r.bottom + 2;        // 2px gap below the input-area
      this.dropdownLeft = r.left;
      this.dropdownWidth = r.width;
    } else if (this.datePickerOpen) {
      this.anchorTop = r.bottom + 2;
      this.anchorLeft = r.left;
    }
    this.cdr.detectChanges();                 // zoneless: reflect the new position
  };

  private addReposition(): void {
    // capture phase catches scrolling on any ancestor, not just the window
    window.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition);
  }
  private removeReposition(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
  }

  /** Click on the input-area — drop-down opens the selector, calendar opens the date-picker */
  protected onInputAreaClick(): void {
    if (this.disabled) return;
    const r = this.inputAreaRect();
    if (!r) return;

    if (this.type === 'drop-down') {
      if (this.dropdownOpen) { this.closeDropdown(); return; }
      this.dropdownTop = r.bottom + 2;        // 2px gap below the input-area
      this.dropdownLeft = r.left;
      this.dropdownWidth = r.width;
      this.dropdownOpen = true;
      this.addReposition();
    } else if (this.type === 'calendar') {
      this.anchorTop = r.bottom + 2;
      this.anchorLeft = r.left;
      this.datePickerOpen = true;
      this.addReposition();
    } else if (this.type === 'attachment') {
      // upload-files opens as a centred modal (no anchoring / repositioning)
      this.uploadFilesOpen = true;
    }
  }

  protected onOptionSelected(e: { index: number; checked: boolean; option: SelectorOption }): void {
    this.applyValue(e.option.label);
    this.closeDropdown();
  }

  protected closeDropdown(): void {
    this.dropdownOpen = false;
    this.removeReposition();
  }

  protected onDatePicked(date: Date): void {
    this.applyValue(date.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' }));
    this.closeDatePicker();
  }

  protected closeDatePicker(): void {
    this.datePickerOpen = false;
    this.removeReposition();
  }

  // ── ATTACHMENT UPLOAD-FILES MODAL (centred, not anchored) ────────────────
  protected uploadFilesOpen = false;

  protected onFilesConfirmed(files: UploadFile[]): void {
    if (files.length) {
      // single file → its name · multiple files → "N files attached"
      this.applyValue(files.length === 1 ? files[0].name : `${files.length} files attached`);
    }
    this.uploadFilesOpen = false;
  }

  get disabled(): boolean { return this.effectiveState === 'disabled'; }

  // ── status icon shown in the label-container (error / warning / accepted) ──
  get hasStatusIcon(): boolean { return ['error', 'warning', 'accepted'].includes(this.effectiveState); }
  get statusIcon(): string {
    if (this.effectiveState === 'error')    return 'x-circle';
    if (this.effectiveState === 'warning')  return 'alert-triangle';
    if (this.effectiveState === 'accepted') return 'check-inside-circle';
    return '';
  }
  get statusIconColor(): string {
    if (this.effectiveState === 'error')    return '#f44336'; // Semantic/Error
    if (this.effectiveState === 'warning')  return '#ff9800'; // Semantic/Alert
    if (this.effectiveState === 'accepted') return '#51b389'; // Semantic/Success
    return '#263b74';
  }

  // ── input-area shape per type ──
  get isEditable(): boolean { return this.type === 'field' || this.type === 'text-area'; }
  get isMultiline(): boolean { return this.type === 'text-area'; }

  get leadingIcon(): string {
    if (this.type === 'calendar')   return 'calendar';
    if (this.type === 'attachment') return 'paperclip';
    return '';
  }
  get trailingIcon(): string {
    if (this.type === 'drop-down') return 'chevron-down';
    // calendar & attachment show a clear (x) icon once a value is present
    if ((this.type === 'calendar' || this.type === 'attachment') && this.value && !this.disabled) return 'x';
    return '';
  }

  /** Trailing action-icon click — drop-down opens the selector, calendar/attachment clears the value */
  protected onActionIconClick(): void {
    this.actionClick.emit();
    if (this.type === 'drop-down') {
      this.onInputAreaClick();
    } else if ((this.type === 'calendar' || this.type === 'attachment') && this.value) {
      this.applyValue('');                    // clear value + reset validation
    }
  }

  get resolvedPlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    switch (this.type) {
      case 'drop-down':  return 'Select';
      case 'calendar':   return 'Select date';
      case 'attachment': return 'Attach file';
      default:           return 'Place holder';
    }
  }
}
