import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'pds-command-bar',
  standalone: true,
  imports: [ButtonComponent, SearchComponent],
  templateUrl: './command-bar.component.html',
  styleUrl: './command-bar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CommandBarComponent {
  /** Page title — fills available width */
  @Input() title = 'Page Title';

  /** Back button */
  @Output() back = new EventEmitter<void>();

  /** Tertiary button 1 (optional) */
  @Input() showTertiary1 = false;
  @Input() tertiary1Icon = 'settings';
  @Input() tertiary1Label = '';
  @Output() tertiary1Click = new EventEmitter<void>();

  /** Tertiary button 2 (optional) */
  @Input() showTertiary2 = false;
  @Input() tertiary2Icon = 'filter';
  @Input() tertiary2Label = '';
  @Output() tertiary2Click = new EventEmitter<void>();

  /** Secondary button (optional) */
  @Input() showSecondary = false;
  @Input() secondaryLabel = 'Cancel';
  @Output() secondaryClick = new EventEmitter<void>();

  /** Primary button (optional) */
  @Input() showPrimary = false;
  @Input() primaryLabel = 'Save';
  @Output() primaryClick = new EventEmitter<void>();

  /** Search suggestion list — passed down to the embedded search */
  @Input() searchSuggestions: string[] = [];
  @Output() searchSelected = new EventEmitter<string>();

  onBack(): void { this.back.emit(); }
}
