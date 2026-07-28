import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { PopupLayoutComponent } from '../popup-layout/popup-layout.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpFooterComponent } from '../pop-up-footer/pop-up-footer.component';
import {
  FilterSectionComponent,
  FilterSectionType,
  FilterOption,
  FilterInputRow,
} from '../filter-section/filter-section.component';

export interface FilterDrawerSection {
  type: FilterSectionType;
  title: string;
  options?: FilterOption[];
  inputRows?: FilterInputRow[];
  searchPlaceholder?: string;
}

@Component({
  selector: 'pds-filter-drawer',
  standalone: true,
  imports: [PopupLayoutComponent, PopUpHeaderComponent, PopUpFooterComponent, FilterSectionComponent],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FilterDrawerComponent {
  @Input() visible = false;

  @Input() title = 'Title Text';
  @Input() subtitle = 'Long subtitle text will display here like this.';
  @Input() icon = 'filter';

  @Input() sections: FilterDrawerSection[] = [];

  /** Index of the single expanded section (accordion) — -1 = all collapsed */
  @Input() expandedIndex = 0;

  @Input() resetLabel = 'Reset';
  @Input() applyLabel = 'Apply';

  @Output() closed = new EventEmitter<void>();
  @Output() applyClick = new EventEmitter<void>();
  @Output() resetClick = new EventEmitter<void>();

  /** Accordion — expanding one section collapses every other */
  onSectionToggle(index: number, state: 'expanded' | 'collapsed'): void {
    this.expandedIndex = state === 'expanded' ? index : -1;
  }

  /** Reset — clear every selection and input value across all sections */
  reset(): void {
    this.sections.forEach((section) => {
      section.options?.forEach((o) => (o.checked = false));
      section.inputRows?.forEach((row) => row.forEach((f) => (f.value = '')));
    });
    this.resetClick.emit();
  }
}
