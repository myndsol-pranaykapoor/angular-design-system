import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation, ElementRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ChipTagComponent } from '../chip-tag/chip-tag.component';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ScrollerComponent } from '../scroller/scroller.component';
import { InputFieldComponent, InputFieldType, InputFieldState } from '../input-field/input-field.component';

export type FilterSectionType = 'multi-selection' | 'input';
export type FilterSectionState = 'expanded' | 'collapsed';

export interface FilterOption {
  label: string;
  checked: boolean;
}

export interface FilterInputField {
  type: InputFieldType;
  label: string;
  value?: string;
  placeholder?: string;
  state?: InputFieldState;
}

/** A horizontal row of one or more input-fields */
export type FilterInputRow = FilterInputField[];

@Component({
  selector: 'pds-filter-section',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ChipTagComponent,
    ButtonComponent,
    SearchComponent,
    CheckboxComponent,
    ScrollerComponent,
    InputFieldComponent,
  ],
  templateUrl: './filter-section.component.html',
  styleUrl: './filter-section.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FilterSectionComponent {
  @Input() type: FilterSectionType = 'multi-selection';
  @Input() state: FilterSectionState = 'expanded';

  @Input() title = 'Section Title';

  /** Multi-Selection */
  @Input() options: FilterOption[] = [];
  @Input() searchPlaceholder = 'Search';

  /** Input */
  @Input() inputRows: FilterInputRow[] = [];

  /** Show the count chip in the header */
  @Input() showChip = true;
  /** Override the chip label; when empty it is computed as `selected/total` */
  @Input() chipLabel = '';

  @Output() stateChange = new EventEmitter<FilterSectionState>();
  @Output() optionToggle = new EventEmitter<{ index: number; option: FilterOption }>();
  @Output() chipAction = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  constructor(private host: ElementRef<HTMLElement>) {}

  @HostBinding('class') get hostClass(): string {
    return `pds-filter-section pds-filter-section--${this.type} pds-filter-section--${this.state}`;
  }

  get isExpanded(): boolean {
    return this.state === 'expanded';
  }

  get selectedCount(): number {
    return this.options.filter((o) => o.checked).length;
  }

  /** Option labels — fed to the search as selectable suggestions (command-bar style overlay) */
  get optionLabels(): string[] {
    return this.options.map((o) => o.label);
  }

  /** Compact multi-selection: 5 or fewer options → no search, no scroller, list hugs height */
  get compact(): boolean {
    return this.type === 'multi-selection' && this.options.length <= 5;
  }

  /** Total input-fields across every row */
  get totalInputFields(): number {
    return this.inputRows.reduce((sum, row) => sum + row.length, 0);
  }

  /** Input-fields that currently hold a value */
  get filledInputFields(): number {
    return this.inputRows.reduce(
      (sum, row) => sum + row.filter((f) => !!f.value).length,
      0,
    );
  }

  /** Count shown in the header chip — selected/total (multi) or filled/total (input) */
  get countChip(): string {
    if (this.chipLabel) return this.chipLabel;
    if (this.type === 'input') return `${this.filledInputFields}/${this.totalInputFields}`;
    return `${this.selectedCount}/${this.options.length}`;
  }

  /** Chip is shown only when there is something to count.
   *  Both types hide it until at least one option is selected / field is filled. */
  get displayChip(): boolean {
    if (!this.showChip) return false;
    if (this.type === 'input') return this.filledInputFields > 0;
    return this.selectedCount > 0;
  }

  /** Keep the row model in sync as the user fills an input-field */
  onFieldValueChange(field: FilterInputField, value: string): void {
    field.value = value;
  }

  /** A suggestion picked from the search overlay → select that option in the list
   *  and scroll the list so the matched line item is visible. */
  onSuggestionSelected(label: string): void {
    const option = this.options.find((o) => o.label === label && !o.checked)
      ?? this.options.find((o) => o.label === label);
    if (!option) return;
    const index = this.options.indexOf(option);
    option.checked = true;
    this.optionToggle.emit({ index, option });
    this.scrollOptionIntoView(index);
  }

  /** Scroll the scroller viewport so the option at `index` is centred in view */
  private scrollOptionIntoView(index: number): void {
    requestAnimationFrame(() => {
      const root = this.host.nativeElement;
      const viewport = root.querySelector<HTMLElement>('.pds-scroller__viewport');
      const optionEl = root.querySelectorAll<HTMLElement>('.pds-filter-section__option')[index];
      if (!viewport || !optionEl) return;
      const vpRect = viewport.getBoundingClientRect();
      const optRect = optionEl.getBoundingClientRect();
      const delta = (optRect.top - vpRect.top) - (viewport.clientHeight - optionEl.offsetHeight) / 2;
      viewport.scrollTo({ top: viewport.scrollTop + delta, behavior: 'smooth' });
    });
  }

  toggleExpand(): void {
    this.state = this.isExpanded ? 'collapsed' : 'expanded';
    this.stateChange.emit(this.state);
  }

  toggleOption(index: number): void {
    const option = this.options[index];
    if (!option) return;
    option.checked = !option.checked;
    this.optionToggle.emit({ index, option });
  }

  /** Chip cancel (×) — clear all selections / inputs (count returns to 0, chip hides) */
  clearSelection(): void {
    this.options.forEach((o) => (o.checked = false));
    this.inputRows.forEach((row) => row.forEach((f) => (f.value = '')));
    this.chipAction.emit();
  }
}
